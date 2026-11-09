import numpy as np, wave
sr=44100; T=25.5; n=int(sr*T); mus=np.zeros(n); sfx=np.zeros(n); rs=np.random.RandomState(3)
def add(buf,t0,sig,gain=1.0):
    i=int(t0*sr); j=min(n,i+len(sig))
    if i<n: buf[i:j]+=sig[:j-i]*gain
tt=lambda d: np.arange(int(d*sr))/sr
N=lambda m:440*2**((m-69)/12)
def pluck(f,d=.7):
    t=tt(d); return (np.sin(2*np.pi*f*t)+.4*np.sin(4*np.pi*f*t)+.15*np.sin(6*np.pi*f*t))*np.exp(-t*7)*np.minimum(1,t*400)
def bass(f,d=.45):
    t=tt(d); return (np.sin(2*np.pi*f*t)+.3*np.sin(4*np.pi*f*t))*np.exp(-t*5)*np.minimum(1,t*200)
def sweep(f0,f1,d,dec=6):
    t=tt(d); f=f0+(f1-f0)*t/d; ph=2*np.pi*np.cumsum(f)/sr; return np.sin(ph)*np.exp(-t*dec)*np.minimum(1,t*300)
def noise(d,smooth=8,dec=20):
    x=rs.randn(int(d*sr)); x=np.convolve(x,np.ones(smooth)/smooth,'same'); t=tt(d); return x*np.exp(-t*dec)
chords=[[60,64,67,72],[57,60,64,69],[53,57,60,65],[55,59,62,67]]; roots=[36,33,29,31]; pat=[0,2,1,3,2,1,3,2]
t=0.0; bar=0
while t<24.4:
    if not (9.4<=t<10.4):
        ch=chords[bar%4]
        for i,k in enumerate(pat): add(mus,t+i*.25,pluck(N(ch[k])),.5 if i%2 else .7)
        add(mus,t,bass(N(roots[bar%4])),1.3); add(mus,t+1,bass(N(roots[bar%4])),1.1); add(mus,t+1.75,bass(N(roots[bar%4]+12),.2),.7)
        for i in range(4): add(mus,t+.25+i*.5,noise(.05,3,60),.25)
    t+=2; bar+=1
for m in [48,60,64,67,72]: add(mus,24.5,pluck(N(m),1.0),.8)
for d in [.6,2.2,3.8,5.4,7.0,8.6]: add(sfx,d,sweep(700,1700,.09,25),.5)
add(sfx,4.3,noise(.02,2,200),.6)
t_=tt(.6); add(sfx,5.7,np.sin(2*np.pi*70*t_+3*np.sin(2*np.pi*23*t_))*np.exp(-t_*4)*np.minimum(1,t_*30),.8)
add(sfx,6.93,sweep(350,1100,.18,8),.5)
t_=tt(.8); add(sfx,7.7,np.sin(2*np.pi*np.cumsum(220+380*t_/.8+12*np.sin(2*np.pi*30*t_))/sr)*np.minimum(1,t_*10)*.5,.5)
add(sfx,8.5,noise(.06,2,60),1.0); add(sfx,8.5,sweep(1400,300,.12,20),.5); add(sfx,8.72,sweep(110,60,.3,10),1.2); add(sfx,8.74,noise(.3,10,12),.5)
t_=tt(.35); add(sfx,9.2,rs.randn(len(t_))*np.sin(np.pi*t_/.35)**2*.3,.8)
for m in [60,64,67,72]: add(sfx,9.52,pluck(N(m),.9),.55)
add(sfx,9.75,sweep(1568,1568,.5,6),.3)
for a,b in [(11.2,13.5),(14.6,16.6)]:
    for x in np.arange(a,b,.13): add(sfx,x,noise(.012,2,300),.5)
t_=tt(1.1); add(sfx,13.5,np.sin(2*np.pi*(120+60*np.sin(2*np.pi*7*t_))*t_)*np.sin(np.pi*t_/1.1)*.6,.6)
add(sfx,15.55,sweep(180,900,.12,10),.9); add(sfx,15.55,noise(.05,3,60),.6)
t_=tt(3.4); gur=np.convolve(rs.randn(len(t_)),np.ones(40)/40,'same')*6*(0.5+0.5*np.sin(2*np.pi*(9-3*t_/2)*t_))*np.sin(np.pi*t_/3.4)
add(sfx,15.6,gur,.6)
for x in np.arange(15.8,19.0,.2): add(sfx,x,sweep(300+rs.rand()*200,500+rs.rand()*300,.07,30),.35)
for i,m in enumerate([72,76,79,84]): add(sfx,19.2+i*.11,pluck(N(m),.8),.6)
for i in range(6): add(sfx,15.9+i*.5,sweep(420+i*70,1300+i*110,.7,2.5),.3); add(sfx,16.25+i*.5,sweep(260,520,.06,30),.5)
out=np.tanh(.2*mus+.5*sfx); f=int(.5*sr); out[-f:]*=np.linspace(1,0,f)
st=(np.stack([out,out],1)*32000).astype(np.int16)
w=wave.open('audio.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes(st.tobytes()); w.close()
