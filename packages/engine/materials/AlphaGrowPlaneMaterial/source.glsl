// uniform float time;

czm_material czm_getMaterial(czm_materialInput materialInput) {
    czm_material material = czm_getDefaultMaterial(materialInput);
    vec4 color = texture2D(map, materialInput.st);
    material.diffuse = color.rgb;
    material.alpha = clamp(abs(sin(time)), 0., 0.75) * 1.3333 * color.a;
    return material;
}