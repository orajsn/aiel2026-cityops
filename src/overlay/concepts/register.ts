import { registerOverlay } from '../registry';
import { TitleCard } from './TitleCard';
import { PinLegend } from './PinLegend';
import { DataCounters } from './DataCounters';
import { QuestionBubble } from './QuestionBubble';
import { CoreCaption } from './CoreCaption';
import { SmallBrain } from './SmallBrain';
import { BridgeMarkers } from './BridgeMarkers';

registerOverlay('TitleCard', TitleCard);
registerOverlay('PinLegend', PinLegend);
registerOverlay('DataCounters', DataCounters);
registerOverlay('QuestionBubble', QuestionBubble);
registerOverlay('CoreCaption', CoreCaption);
registerOverlay('SmallBrain', SmallBrain);
registerOverlay('BridgeMarkers', BridgeMarkers);
