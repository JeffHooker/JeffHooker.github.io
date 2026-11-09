import numpy as np, wave
sr=44100; T=24.5; n=int(sr*T); mus=np.zeros(n); sfx=np.zeros(n); rs=np.random.RandomState(7)
def add(buf,t0,sig,gain=1.0):
    i=int(t0*sr); j=min(n,i+len(sig))
    if 0<=i<n: buf[i:j]+=sig[:j-i]*gain
tt=lambda d: np.arange(int(d*sr))/sr
N=lambda m:440*2**((m-69)/12)
def pluck(f,d=.7,dec=7):
    t=tt(d); return (np.sin(2*np.pi*f*t)+.4*np.sin(4*np.pi*f*t)+.15*np.sin(6*np.pi*f*t))*np.exp(-t*dec)*np.minimum(1,t*400)
def bass(f,d=.45,dec=5):
    t=tt(d); return (np.sin(2*np.pi*f*t)+.3*np.sin(4*np.pi*f*t))*np.exp(-t*dec)*np.minimum(1,t*200)
def sweep(f0,f1,d,dec=6):
    t=tt(d); f=f0+(f1-f0)*t/d; ph=2*np.pi*np.cumsum(f)/sr; return np.sin(ph)*np.exp(-t*dec)*np.minimum(1,t*300)
def noise(d,smooth=8,dec=20):
    x=rs.randn(int(d*sr)); x=np.convolve(x,np.ones(smooth)/smooth,'same'); return x*np.exp(-tt(d)*dec)
def sneak(a,b):
    line=[45,48,52,51,45,48,53,52]; t=a; i=0
    while t<b-.2:
        add(mus,t,bass(N(line[i%8]),.28,9),1.5)
        if i%2==1: add(mus,t+.17,pluck(N(line[i%8]+24),.2,18),.45)
        if i%4==3: add(mus,t+.17,noise(.04,3,70),.3)
        t+=.34; i+=1
def happy(a,b):
    chords=[[60,64,67,72],[57,60,64,69],[53,57,60,65],[55,59,62,67]]; roots=[36,33,29,31]; pat=[0,2,1,3,2,1,3,2]; t=a; bar=0
    while t<b-.2:
        ch=chords[bar%4]
        for i,k in enumerate(pat):
            if t+i*.25<b: add(mus,t+i*.25,pluck(N(ch[k])),.5 if i%2 else .7)
        add(mus,t,bass(N(roots[bar%4])),1.3); add(mus,t+1,bass(N(roots[bar%4])),1.1)
        for i in range(4): add(mus,t+.25+i*.5,noise(.05,3,60),.25)
        t+=2; bar+=1
sneak(1.0,8.8); happy(10.1,13.2); sneak(13.5,16.3); happy(17.0,23.3)
for m in [48,60,64,67,72]: add(mus,23.4,pluck(N(m),1.0),.8)
for d in [.3,.62]: add(sfx,d,sweep(1318,1318,.9,5),.45)
for a,b in [(3.0,6.3),(7.1,8.85),(13.6,15.5),(16.9,18.45)]:
    for i,x in enumerate(np.arange(a,b,.15)): add(sfx,x,sweep(1500+200*(i%2),1300,.03,60),.28)
add(sfx,5.9,sweep(500,1200,.22,8),.4)
add(sfx,6.5,sweep(200,900,.1,12),.8); add(sfx,6.5,noise(.05,3,60),.5)
t_=tt(.9); add(sfx,7.25,np.sin(2*np.pi*np.cumsum(420-220*t_/.9+10*np.sin(2*np.pi*6*t_))/sr)*np.sin(np.pi*t_/.9)*.6,.6)
for m in [60,64,67,72]: add(sfx,8.92,pluck(N(m),.9),.55)
t_=tt(1.5); add(sfx,10.8,np.sin(2*np.pi*np.cumsum(220+700*t_/1.5)/sr)*(0.5+0.5*np.sign(np.sin(2*np.pi*46*t_)))*np.sin(np.pi*t_/1.5)*.5,.45)
add(sfx,12.32,noise(.03,2,150),.9); add(sfx,12.32,sweep(900,1400,.08,25),.5)
t_=tt(1.0); add(sfx,15.4,np.sin(2*np.pi*(150+50*np.sin(2*np.pi*9*t_))*t_)*np.sin(np.pi*t_)*.6,.55)
for m in [48,55,60,64,67,72]: add(sfx,16.4,pluck(N(m),1.1,4),.6)
add(sfx,16.4,noise(.12,4,25),.9); add(sfx,16.4,sweep(300,1400,.2,8),.5)
for i,m in enumerate([72,76,79,84]): add(sfx,17.7+i*.11,pluck(N(m),.8),.6)
for d in [20.6,21.0]: add(sfx,d,sweep(700,500,.08,30),.35)
out=np.tanh(.2*mus+.5*sfx); f=int(.5*sr); out[-f:]*=np.linspace(1,0,f)
st=(np.stack([out,out],1)*32000).astype(np.int16)
w=wave.open('audio2.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes(st.tobytes()); w.close()
