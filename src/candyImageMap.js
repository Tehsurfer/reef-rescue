import snapper from './images/snapper.png'
import lobster from './images/lobster.png'
import urchin from './images/urchin.png'
import purpleCandy from './images/purple-candy.png'
import redCandy from './images/red-candy.png'
import yellowCandy from './images/yellow-candy.png'
import blank from './images/blank.png'

const candyImageMap = {
  [snapper]: <img src={snapper} alt="snapper" draggable={false} style={{width: '100%', height: '100%', aspectRatio: '1/1', objectFit: 'contain', pointerEvents: 'none'}} />,
  [purpleCandy]: <img src={purpleCandy} alt="purple" draggable={false} style={{width: '100%', height: '100%', aspectRatio: '1/1', objectFit: 'contain', pointerEvents: 'none'}} />,
  [redCandy]: <img src={redCandy} alt="red" draggable={false} style={{width: '100%', height: '100%', aspectRatio: '1/1', objectFit: 'contain', pointerEvents: 'none'}} />,
  [yellowCandy]: <img src={yellowCandy} alt="yellow" draggable={false} style={{width: '100%', height: '100%', aspectRatio: '1/1', objectFit: 'contain', pointerEvents: 'none'}} />,
  [lobster]: <img src={lobster} alt="lobster" draggable={false} style={{width: '100%', height: '100%', aspectRatio: '1/1', objectFit: 'contain', pointerEvents: 'none'}} />,
  [urchin]: <img src={urchin} alt="urchin" draggable={false} style={{width: '100%', height: '100%', aspectRatio: '1/1', objectFit: 'contain', pointerEvents: 'none'}} />,
  [blank]: <img src={blank} alt="blank" draggable={false} style={{width: '100%', height: '100%', aspectRatio: '1/1', objectFit: 'contain', pointerEvents: 'none'}} />,
}

export {
  snapper,
  lobster,
  urchin,
  purpleCandy,
  redCandy,
  yellowCandy,
  blank,
  candyImageMap
}
