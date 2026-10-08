import math

def compute_box_iou(boxA, boxB):
    # Simplified AABB intersection over union
    # Format: position [x,y,z], scale [w,h,d]
    posA, scaleA = boxA['position'], boxA['scale']
    posB, scaleB = boxB['position'], boxB['scale']
    
    # Calculate min/max for A
    minA = [posA[i] - scaleA[i]/2 for i in range(3)]
    maxA = [posA[i] + scaleA[i]/2 for i in range(3)]
    
    # Calculate min/max for B
    minB = [posB[i] - scaleB[i]/2 for i in range(3)]
    maxB = [posB[i] + scaleB[i]/2 for i in range(3)]
    
    # Intersection min/max
    inter_min = [max(minA[i], minB[i]) for i in range(3)]
    inter_max = [min(maxA[i], maxB[i]) for i in range(3)]
    
    # Check if there is intersection
    if any(inter_min[i] >= inter_max[i] for i in range(3)):
        return 0.0
        
    inter_vol = math.prod(inter_max[i] - inter_min[i] for i in range(3))
    volA = math.prod(scaleA)
    volB = math.prod(scaleB)
    union_vol = volA + volB - inter_vol
    
    return inter_vol / union_vol if union_vol > 0 else 0.0

def compute_geometric_error(boxA, boxB):
    # Simplified point-to-point mean error based on centroids
    # In a full system, this would be Chamfer distance on meshes
    posA, posB = boxA['position'], boxB['position']
    dist = math.sqrt(sum((posA[i] - posB[i])**2 for i in range(3)))
    # add scale error component
    scaleA, scaleB = boxA['scale'], boxB['scale']
    scale_dist = math.sqrt(sum((scaleA[i] - scaleB[i])**2 for i in range(3)))
    return (dist * 0.5) + (scale_dist * 0.5)
