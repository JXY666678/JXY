import os
import urllib.parse
import requests

prompts = {
    'sample_banana.jpg': 'realistic close-up photo of a ripe yellow banana with a peeled banana beside it on a clean white studio background, soft lighting, centered, no text',
    'sample_battery.jpg': 'realistic close-up photo of two used AA alkaline batteries lying on a clean white studio background, blue and silver labels, soft lighting, centered, no text',
    'sample_cup.jpg': 'realistic photo of a used white paper coffee cup and crumpled paper napkin on a clean white studio background, soft lighting, centered, no text',
}
os.makedirs('static/images', exist_ok=True)
for name, prompt in prompts.items():
    url = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=' + urllib.parse.quote(prompt) + '&image_size=square'
    r = requests.get(url, timeout=90)
    print(name, r.status_code, len(r.content))
    if r.ok:
        with open('static/images/' + name, 'wb') as f:
            f.write(r.content)
