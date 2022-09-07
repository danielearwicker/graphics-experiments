export type Vector2d = [x: number, y: number];
export type Vector3d = [x: number, y: number, z: number];
export function scale2d(v: Vector2d, scale: number): Vector2d {
    return [v[0] * scale, v[1] * scale];
}

export function scale3d(v: Vector3d, scale: number): Vector3d {
    return [v[0] * scale, v[1] * scale, v[2] * scale];
}

export function add3d(v1: Vector3d, v2: Vector3d): Vector3d {
    return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
}

export function add2d(v1: Vector2d, v2: Vector2d): Vector2d {
    return [v1[0] + v2[0], v1[1] + v2[1]];
}

export function subtract3d(v1: Vector3d, v2: Vector3d): Vector3d {
    return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
}

export function subtract2d(v1: Vector2d, v2: Vector2d): Vector2d {
    return [v1[0] - v2[0], v1[1] - v2[1]];
}

export function lengthSquared3d(v: Vector3d) {
    return (v[0] * v[0]) + (v[1] * v[1]) + (v[2] * v[2]);
}
