#!/usr/bin/env python3
"""Local-only review server with byte ranges for seeking the original MP4s."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import re

ROOT=Path(__file__).resolve().parent
class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs):
        super().__init__(*args,directory=str(ROOT),**kwargs)
    def send_head(self):
        self.remaining=None
        path=Path(self.translate_path(self.path))
        if path.is_dir():
            self.send_error(404);return None
        try:
            f=path.open('rb');size=path.stat().st_size
        except OSError:
            self.send_error(404);return None
        start,end=0,size-1
        header=self.headers.get('Range')
        if header:
            m=re.fullmatch(r'bytes=(\d+)-(\d*)',header)
            if not m:
                f.close();self.send_error(416);return None
            start=int(m[1]);end=min(int(m[2]) if m[2] else end,end)
            if start>end:
                f.close();self.send_error(416);return None
            self.send_response(206)
            self.send_header('Content-Range',f'bytes {start}-{end}/{size}')
        else:self.send_response(200)
        self.send_header('Content-Type',self.guess_type(str(path)))
        self.send_header('Content-Length',str(end-start+1))
        self.send_header('Accept-Ranges','bytes')
        self.send_header('Cache-Control','no-cache')
        self.end_headers()
        f.seek(start);self.remaining=end-start+1
        return f
    def copyfile(self,source,outputfile):
        try:
            while self.remaining:
                chunk=source.read(min(1024*1024,self.remaining))
                if not chunk:break
                outputfile.write(chunk);self.remaining-=len(chunk)
        except (BrokenPipeError,ConnectionResetError):pass
    def log_message(self,*args):pass

print('Review: http://127.0.0.1:8766/CHECKPOINT-1.html',flush=True)
ThreadingHTTPServer(('127.0.0.1',8766),Handler).serve_forever()
