czm_material czm_getMaterial(czm_materialInput materialInput) {
    czm_material material = czm_getDefaultMaterial(materialInput);
    vec2 st = repeat * materialInput.st;
    vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));
    material.alpha = colorImage.a * color.a;
    material.diffuse = (colorImage.rgb + color.rgb) / 2.0;
    return material;
}