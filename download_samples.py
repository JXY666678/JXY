import os
import requests

samples = {
    'sample_bottle.jpg': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ad/Bottle_of_Water.jpg/960px-Bottle_of_Water.jpg',
    'sample_banana.jpg': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Banana_peel_on_seat.JPG/960px-Banana_peel_on_seat.JPG',
    'sample_battery.jpg': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/99/02_-_Single_Energizer_Battery.jpg/960px-02_-_Single_Energizer_Battery.jpg',
    'sample_mask.jpg': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/A_Discarded_Mask_%2850592873738%29.jpg/960px-A_Discarded_Mask_%2850592873738%29.jpg',
}
headers = {'User-Agent': 'CampusWasteDemo/1.0 (educational demo)'}
os.makedirs('static/images', exist_ok=True)
for name, url in samples.items():
    r = requests.get(url, headers=headers, timeout=60)
    print(name, r.status_code, r.headers.get('content-type'), len(r.content))
    if r.ok and r.headers.get('content-type', '').startswith('image'):
        with open('static/images/' + name, 'wb') as f:
            f.write(r.content)
