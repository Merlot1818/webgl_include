uniform int useScreenCoordinates;
uniform int sizeAttenuation;
uniform vec3 screenPosition;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float rotation;
uniform vec2 scale;
uniform vec2 alignment;
uniform vec2 uvOffset;
uniform vec2 uvScale;
uniform bool vertical;
uniform float fixedSize;
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUV;

void main() {
  vec4 finalPosition;
  finalPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
  vUV = uvOffset + uv * uvScale;
  vec2 finalScale;
  if(fixedSize != 0.0){
    finalScale = scale  * length(finalPosition.xyz) / fixedSize;
  }else{
    finalScale = scale;
  }
  vec2 alignedPosition = (position + alignment) * finalScale;
  vec2 rotatedPosition;
  rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
  rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
  vec4 upPosition;
  vec4 rightPosition = vec4(finalScale.x,0.0,0.0,1.0);
  if(vertical){
    upPosition =  modelViewMatrix * vec4( 0.0, 1.0, 0.0, 1.0 ) - finalPosition;
    normalize(upPosition);
  }
  if(vertical){
    finalPosition.xyz += (rotatedPosition.x * rightPosition.xyz / finalScale.x) + (rotatedPosition.y * upPosition.xyz / scale.y);
  }else{
    finalPosition.xy += rotatedPosition;
  }
  finalPosition = projectionMatrix * finalPosition;
  gl_Position = finalPosition;
}