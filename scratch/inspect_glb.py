import struct
import json

with open('public/models/arctic_crew_quaters.glb', 'rb') as f:
    magic, version, length = struct.unpack('<III', f.read(12))
    chunk_len, chunk_type = struct.unpack('<II', f.read(8))
    json_bytes = f.read(chunk_len)
    data = json.loads(json_bytes.decode('utf-8'))
    
    print('GLTF Version:', version)
    print('Generator:', data.get('asset', {}).get('generator'))
    print('Nodes count:', len(data.get('nodes', [])))
    print('Meshes count:', len(data.get('meshes', [])))
    print('Materials count:', len(data.get('materials', [])))
    print('Animations count:', len(data.get('animations', [])))
    
    print('\nNodes overview:')
    for i, node in enumerate(data.get('nodes', [])):
        print(f" Node {i}: name='{node.get('name', '')}', mesh={node.get('mesh')}")
        
    if 'animations' in data and len(data['animations']) > 0:
        print('\nAnimations:')
        for anim in data['animations']:
            print(' Anim name:', anim.get('name', 'unnamed'))
