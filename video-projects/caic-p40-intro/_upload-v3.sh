#!/bin/sh
# Re-upload the fixed P4.0 render as a NEW REVISION of the existing Drive file (same ID, same share link).
# Needs a Drive-scoped token:  gcloud auth login aidan@uppitai.com --enable-gdrive-access
set -e
cd "$(dirname "$0")"
FILE="renders/CAIC P4.0.mp4"
ID="1wmglHX35TLrluJzXQXXwwC9VAXwblMiR"
TOK=$(gcloud auth print-access-token)
SIZE=$(stat -f%z "$FILE")
LOCAL_MD5=$(md5 -q "$FILE")
echo "uploading $FILE ($SIZE bytes, md5 $LOCAL_MD5) -> Drive $ID"
LOC=$(curl -s -D - -o /dev/null -X PATCH \
  -H "Authorization: Bearer $TOK" -H "Content-Type: application/json" \
  -H "X-Upload-Content-Type: video/mp4" -H "X-Upload-Content-Length: $SIZE" \
  -d '{}' "https://www.googleapis.com/upload/drive/v3/files/$ID?uploadType=resumable&supportsAllDrives=true" \
  | tr -d '\r' | awk 'tolower($1)=="location:"{print $2}')
[ -n "$LOC" ] || { echo "no resumable session (token expired? run the gcloud login above)"; exit 1; }
curl -s -o /dev/null -w "upload http %{http_code}\n" -X PUT -H "Content-Type: video/mp4" -H "Content-Length: $SIZE" --upload-file "$FILE" "$LOC"
REMOTE=$(curl -s -H "Authorization: Bearer $(gcloud auth print-access-token)" "https://www.googleapis.com/drive/v3/files/$ID?fields=name,size,md5Checksum,modifiedTime&supportsAllDrives=true")
echo "$REMOTE"
echo "$REMOTE" | grep -q "$LOCAL_MD5" && echo "MD5 VERIFIED" || { echo "MD5 MISMATCH"; exit 1; }
