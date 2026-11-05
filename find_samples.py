import json
import requests

queries = ['plastic water bottle', 'banana peel', 'AA battery', 'used paper cup', 'disposable mask waste', 'apple core']
headers = {'User-Agent': 'CampusWasteDemo/1.0 (educational demo)'}
for q in queries:
    params = {
        'action': 'query', 'generator': 'search', 'gsrsearch': q, 'gsrnamespace': 6,
        'gsrlimit': 4, 'prop': 'imageinfo', 'iiprop': 'url|mime|size', 'iiurlwidth': 640,
        'format': 'json'
    }
    r = requests.get('https://commons.wikimedia.org/w/api.php', params=params, headers=headers, timeout=30)
    print('\n##', q, r.status_code)
    data = r.json().get('query', {}).get('pages', {})
    for p in data.values():
        info = p.get('imageinfo', [{}])[0]
        print(p.get('title'), info.get('mime'), info.get('width'), info.get('thumburl'))
