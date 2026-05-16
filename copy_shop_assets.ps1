$shopDir = "c:\Users\PC\Desktop\codex\Dj Website\New\my-next-app\public\assets\shop"
if (-not (Test-Path $shopDir)) { New-Item -ItemType Directory -Force -Path $shopDir }

$brainDir = "C:\Users\PC\.gemini\antigravity\brain\60973d14-e0a6-454d-b7f6-47f0790ed7f2"

Copy-Item "$brainDir\lower_third_neon_1778955414779.png" "$shopDir\lower-third-neon.png" -Force
Copy-Item "$brainDir\social_media_pack_1778955431001.png" "$shopDir\social-media-pack.png" -Force
Copy-Item "$brainDir\event_flyer_template_1778955452193.png" "$shopDir\event-flyer-template.png" -Force
Copy-Item "$brainDir\title_animation_pack_1778955477193.png" "$shopDir\title-animation-pack.png" -Force
Copy-Item "$brainDir\logo_reveal_template_1778955491549.png" "$shopDir\logo-reveal-template.png" -Force
Copy-Item "$brainDir\transition_pack_1778955509045.png" "$shopDir\transition-pack.png" -Force
Copy-Item "$brainDir\music_visualizer_1778955524527.png" "$shopDir\music-visualizer.png" -Force
Copy-Item "$brainDir\lyric_video_template_1778955538549.png" "$shopDir\lyric-video-template.png" -Force

Write-Host "Done copying shop assets!"
