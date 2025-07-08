import snapper from './images/snapper.png'
import lobster from './images/lobster.png'
import urchin from './images/urchin.png'
import kelp from './images/kelp.png'
import rock from './images/rock.png'
import crab from './images/crab.png'
import blank from './images/blank.png'

const candyImageMap = {
  [snapper]: <img src={snapper} alt="snapper" draggable={false} style={{width: '100%', height: '100%', aspectRatio: '1/1', objectFit: 'contain', pointerEvents: 'none'}} />,
  [kelp]: <img src={kelp} alt="purple" draggable={false} style={{width: '100%', height: '100%', aspectRatio: '1/1', objectFit: 'contain', pointerEvents: 'none'}} />,
  [rock]: <img src={rock} alt="red" draggable={false} style={{width: '100%', height: '100%', aspectRatio: '1/1', objectFit: 'contain', pointerEvents: 'none'}} />,
  [crab]: <img src={crab} alt="yellow" draggable={false} style={{width: '100%', height: '100%', aspectRatio: '1/1', objectFit: 'contain', pointerEvents: 'none'}} />,
  [lobster]: <img src={lobster} alt="lobster" draggable={false} style={{width: '100%', height: '100%', aspectRatio: '1/1', objectFit: 'contain', pointerEvents: 'none'}} />,
  [urchin]: <img src={urchin} alt="urchin" draggable={false} style={{width: '100%', height: '100%', aspectRatio: '1/1', objectFit: 'contain', pointerEvents: 'none'}} />,
  [blank]: <img src={blank} alt="blank" draggable={false} style={{width: '100%', height: '100%', aspectRatio: '1/1', objectFit: 'contain', pointerEvents: 'none'}} />,
}

export {
  snapper,
  lobster,
  urchin,
  kelp,
  rock,
  crab,
  blank,
  candyImageMap
}
