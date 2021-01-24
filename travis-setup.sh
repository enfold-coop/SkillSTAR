#!/usr/bin/env bash
# Creates empty video files, so Travis CI can properly run tests
set -o errexit

main() {
  local top="$(git rev-parse --show-toplevel)"
  local videos_dir="${top}/assets/videos"
  mkdir -p $videos_dir
  for i in {1..14}
  do
    local file_name="toothbrushing_$(printf "%02d" "$i").mp4"
    local file_path="$videos_dir/$file_name"
    touch $file_path
    echo "empty video file created at $file_path"
  done
}

main "${@}"
