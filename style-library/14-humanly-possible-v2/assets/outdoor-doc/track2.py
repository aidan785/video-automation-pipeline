import numpy as np, sys, json
W,H=960,540
d=np.fromfile(sys.argv[1],np.uint8).reshape(-1,H,W).astype(np.float32)
def track(cx,cy,hw,hh):
    ref=d[0,cy-hh:cy+hh,cx-hw:cx+hw]; ref=ref-ref.mean(); out=[]; px,py=0,0
    for f in d:
        S={}
        for dy in range(py-5,py+6):
            for dx in range(px-5,px+6):
                p=f[cy-hh+dy:cy+hh+dy,cx-hw+dx:cx+hw+dx]; S[(dx,dy)]=(((p-p.mean())-ref)**2).mean()
        (px,py)=min(S,key=S.get)
        def sub(a,b,c): 
            den=a-2*b+c; return 0 if den<=0 else 0.5*(a-c)/den
        sx=sub(S.get((px-1,py),S[(px,py)]),S[(px,py)],S.get((px+1,py),S[(px,py)]))
        sy=sub(S.get((px,py-1),S[(px,py)]),S[(px,py)],S.get((px,py+1),S[(px,py)]))
        out.append((px+sx,py+sy))
    return np.array(out)
a=track(760,220,70,70); b=track(800,430,70,45)
t=(a+b)/2*2  # to 1920 px
k=np.array([1,2,3,2,1],float);k/=k.sum()
sm=np.stack([np.convolve(np.pad(t[:,i],2,mode='edge'),k,'valid') for i in range(2)],1)
print("diff a-b max",np.abs(a-b).max()*2)
json.dump([[round(x,1),round(y,1)] for x,y in sm],open(sys.argv[2],'w'))
print(sm[::12].round(1).tolist())
