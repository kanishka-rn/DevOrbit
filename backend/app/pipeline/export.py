import open3d as o3d
import numpy as np
import os
import math

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) / 255.0 for i in (0, 2, 4))

def create_scene_mesh(nodes):
    scene_mesh = o3d.geometry.TriangleMesh()
    
    for node in nodes:
        # Create a box for each node
        scale = node.get("scale", [1, 1, 1])
        # Open3D's create_box creates a box from [0,0,0] to [width, height, depth]
        # We need to center it or align it. Let's just create and then transform.
        box = o3d.geometry.TriangleMesh.create_box(width=scale[0], height=scale[1], depth=scale[2])
        
        # Center the box
        box.translate(np.array([-scale[0]/2, -scale[1]/2, -scale[2]/2]))
        
        # Color
        if "material" in node and "color" in node["material"]:
            color = hex_to_rgb(node["material"]["color"])
            box.paint_uniform_color(color)
        else:
            box.paint_uniform_color([0.5, 0.5, 0.5])
            
        # Rotation
        rot = node.get("rotation", [0, 0, 0])
        # Open3D uses rotation matrices. We can use get_rotation_matrix_from_xyz
        R = box.get_rotation_matrix_from_xyz((rot[0], rot[1], rot[2]))
        box.rotate(R, center=(0, 0, 0))
        
        # Translation
        pos = node.get("position", [0, 0, 0])
        box.translate(np.array(pos))
        
        # Merge
        scene_mesh += box
        
    # Compute normals
    scene_mesh.compute_vertex_normals()
    return scene_mesh

def export_scene(world_id, nodes, format="glb"):
    OUTPUT_DIR = "data/exports"
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    filepath = f"{OUTPUT_DIR}/{world_id}_scene.{format}"
    
    mesh = create_scene_mesh(nodes)
    o3d.io.write_triangle_mesh(filepath, mesh)
    
    return filepath
