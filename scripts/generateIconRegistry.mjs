import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const dynamicImportsPath = join(
  root,
  'node_modules/lucide-react/dist/esm/dynamicIconImports.mjs',
);

const outputPath = join(root, 'src/packages/icon/iconRegistryData.ts');

const kebabToPascal = (kebab) =>
  kebab
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

const kebabToLabel = (kebab) =>
  kebab
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const CATEGORY_RULES = [
  { category: 'animals', keywords: ['dog', 'cat', 'bird', 'fish', 'bug', 'bee', 'butterfly', 'paw', 'rabbit', 'turtle', 'snake', 'whale', 'dolphin', 'elephant', 'lion', 'tiger', 'bear', 'fox', 'wolf', 'deer', 'horse', 'cow', 'pig', 'sheep', 'goat', 'chicken', 'duck', 'owl', 'eagle', 'crow', 'spider', 'worm', 'squirrel', 'hamster', 'pet', 'animal', 'panda', 'koala', 'monkey', 'frog', 'crab', 'lobster', 'octopus', 'bat', 'mouse', 'rat', 'penguin', 'parrot', 'swan', 'dove', 'snail', 'ant', 'beetle'] },
  { category: 'nature', keywords: ['tree', 'leaf', 'flower', 'plant', 'forest', 'mountain', 'hill', 'rock', 'stone', 'gem', 'diamond', 'crystal', 'seed', 'sprout', 'branch', 'pine', 'palm', 'cactus', 'mushroom', 'clover', 'rose', 'tulip', 'sunflower', 'daisy', 'lotus', 'blossom', 'vine', 'grass', 'garden', 'landscape', 'earth', 'globe', 'planet', 'comet', 'galaxy', 'volcano', 'waterfall', 'river', 'lake', 'ocean', 'sea', 'wave', 'beach', 'island', 'coral', 'snowflake', 'ice', 'frost'] },
  { category: 'food', keywords: ['food', 'coffee', 'tea', 'cup', 'mug', 'wine', 'beer', 'cocktail', 'drink', 'beverage', 'pizza', 'burger', 'sandwich', 'bread', 'cake', 'cookie', 'candy', 'chocolate', 'ice-cream', 'fruit', 'apple', 'banana', 'cherry', 'grape', 'lemon', 'orange', 'peach', 'pear', 'strawberry', 'watermelon', 'vegetable', 'carrot', 'corn', 'egg', 'meat', 'sushi', 'noodle', 'soup', 'salad', 'cheese', 'milk', 'bottle', 'utensil', 'fork', 'knife', 'spoon', 'plate', 'bowl', 'pot', 'pan', 'grill', 'oven', 'stove', 'kitchen', 'restaurant', 'chef', 'croissant', 'donut', 'muffin', 'pretzel', 'popcorn', 'nut', 'bean', 'grain', 'rice', 'wheat', 'honey', 'salt', 'pepper', 'avocado', 'broccoli', 'tomato', 'potato', 'onion', 'garlic', 'ginger', 'sausage', 'bacon', 'ham', 'steak'] },
  { category: 'weather', keywords: ['weather', 'cloud', 'sun', 'rain', 'snow', 'storm', 'thunder', 'lightning', 'wind', 'fog', 'mist', 'haze', 'drizzle', 'shower', 'hurricane', 'tornado', 'cyclone', 'blizzard', 'hail', 'sleet', 'rainbow', 'thermometer', 'temperature', 'forecast', 'climate', 'umbrella', 'sunrise', 'sunset', 'moon', 'eclipse', 'star'] },
  { category: 'travel', keywords: ['travel', 'car', 'bus', 'train', 'plane', 'airplane', 'ship', 'boat', 'bike', 'bicycle', 'motorcycle', 'scooter', 'taxi', 'truck', 'van', 'ambulance', 'subway', 'metro', 'tram', 'ferry', 'yacht', 'sail', 'anchor', 'compass', 'map', 'navigation', 'route', 'road', 'highway', 'street', 'bridge', 'tunnel', 'airport', 'station', 'port', 'harbor', 'luggage', 'suitcase', 'backpack', 'passport', 'ticket', 'hotel', 'camping', 'tent', 'hiking', 'climbing', 'ski', 'snowboard', 'surf', 'landmark', 'monument', 'castle', 'palace', 'tower', 'destination', 'journey', 'trip', 'vacation', 'holiday', 'tour', 'guide', 'explorer', 'adventure', 'flight', 'boarding', 'baggage', 'parking', 'garage', 'fuel', 'gas', 'traffic', 'driver', 'passenger', 'pilot', 'captain', 'lighthouse', 'buoy'] },
  { category: 'people', keywords: ['user', 'person', 'people', 'man', 'woman', 'boy', 'girl', 'child', 'baby', 'family', 'group', 'team', 'friend', 'couple', 'hand', 'finger', 'thumb', 'palm', 'fist', 'wave', 'clap', 'point', 'gesture', 'face', 'head', 'eye', 'ear', 'nose', 'mouth', 'lip', 'tooth', 'hair', 'beard', 'mustache', 'body', 'arm', 'leg', 'foot', 'toe', 'doctor', 'nurse', 'patient', 'hospital', 'clinic', 'pharmacy', 'medicine', 'wheelchair', 'stretcher', 'community', 'society', 'culture', 'ceremony', 'celebration', 'festival', 'wedding', 'funeral', 'graduation', 'meeting', 'conference', 'guest', 'host', 'visitor', 'tourist', 'traveler', 'commuter', 'pedestrian', 'employee', 'employer', 'boss', 'manager', 'director', 'executive', 'customer', 'client', 'consumer', 'teacher', 'professor', 'student', 'pupil', 'learner', 'scholar', 'researcher', 'scientist', 'engineer', 'architect', 'designer', 'developer', 'programmer', 'lawyer', 'attorney', 'judge', 'police', 'officer', 'detective', 'soldier', 'veteran', 'hero'] },
  { category: 'emotions', keywords: ['smile', 'laugh', 'happy', 'joy', 'sad', 'cry', 'tear', 'angry', 'mad', 'frown', 'worry', 'anxiety', 'fear', 'scared', 'surprise', 'shock', 'love', 'heart', 'kiss', 'hug', 'emotion', 'mood', 'feeling', 'expression', 'grin', 'smirk', 'wink', 'blush', 'sweat', 'dizzy', 'confused', 'thinking', 'sleepy', 'tired', 'yawn', 'sick', 'nausea', 'vomit', 'dead', 'skull', 'ghost', 'alien', 'robot', 'devil', 'angel', 'clown', 'joker', 'party', 'celebration', 'cheer', 'excited', 'enthusiastic', 'passionate', 'romantic', 'affectionate', 'tender', 'gentle', 'kind', 'compassionate', 'empathetic', 'sympathetic', 'supportive', 'encouraging', 'motivating', 'inspiring', 'uplifting', 'positive', 'optimistic', 'hopeful', 'confident', 'proud', 'grateful', 'thankful', 'appreciative', 'content', 'satisfied', 'fulfilled', 'peaceful', 'calm', 'relaxed', 'serene', 'tranquil', 'zen', 'mindful'] },
  { category: 'devices', keywords: ['phone', 'mobile', 'smartphone', 'tablet', 'laptop', 'computer', 'desktop', 'monitor', 'screen', 'display', 'keyboard', 'mouse', 'trackpad', 'touchpad', 'printer', 'scanner', 'camera', 'webcam', 'microphone', 'speaker', 'headphone', 'earphone', 'headset', 'watch', 'smartwatch', 'tv', 'television', 'radio', 'stereo', 'amplifier', 'receiver', 'transmitter', 'router', 'modem', 'switch', 'hub', 'server', 'database', 'storage', 'disk', 'drive', 'ssd', 'hdd', 'usb', 'flash', 'memory', 'ram', 'cpu', 'gpu', 'processor', 'chip', 'circuit', 'board', 'motherboard', 'battery', 'charger', 'power', 'adapter', 'cable', 'wire', 'bluetooth', 'wifi', 'wireless', 'network', 'internet', 'cloud', 'satellite', 'gps', 'sensor', 'detector', 'meter', 'gauge', 'scale', 'thermometer', 'barometer', 'hygrometer', 'projector', 'beamer', 'panel', 'touch', 'gesture', 'motion', 'accelerometer', 'gyroscope', 'magnetometer', 'compass', 'altimeter', 'pedometer', 'heart-rate', 'blood-pressure', 'glucose', 'oximeter', 'stethoscope'] },
  { category: 'files', keywords: ['file', 'folder', 'document', 'page', 'paper', 'note', 'notebook', 'journal', 'diary', 'book', 'archive', 'box', 'package', 'envelope', 'mail', 'letter', 'post', 'card', 'tag', 'label', 'bookmark', 'clip', 'pin', 'staple', 'tape', 'glue', 'scissors', 'cut', 'copy', 'paste', 'duplicate', 'clone', 'mirror', 'backup', 'restore', 'recover', 'undo', 'redo', 'history', 'version', 'revision', 'draft', 'template', 'format', 'layout', 'design', 'blueprint', 'plan', 'scheme', 'diagram', 'chart', 'graph', 'table', 'list', 'index', 'catalog', 'directory', 'registry', 'database', 'record', 'entry', 'item', 'object', 'entity', 'instance', 'class', 'type', 'category', 'group', 'set', 'collection', 'array', 'vector', 'matrix', 'tensor', 'scalar', 'variable', 'constant', 'parameter', 'argument', 'option', 'setting', 'config', 'preference', 'profile', 'account', 'login', 'logout', 'signin', 'signout', 'register', 'signup', 'subscribe', 'unsubscribe', 'follow', 'unfollow', 'like', 'dislike', 'share', 'comment', 'reply', 'mention', 'hashtag', 'search', 'find', 'filter', 'sort', 'order', 'rank', 'score', 'rating', 'review', 'feedback', 'report', 'flag', 'block', 'ban', 'mute', 'hide', 'show', 'display', 'view', 'preview', 'print', 'export', 'import', 'upload', 'download', 'sync', 'backup', 'restore', 'migrate', 'transfer', 'move', 'delete', 'remove', 'clear', 'empty', 'fill', 'populate', 'seed', 'generate', 'create', 'make', 'build', 'construct', 'assemble', 'compile', 'link', 'connect', 'join', 'merge', 'split', 'divide', 'separate', 'isolate', 'extract', 'inject', 'embed', 'include', 'exclude', 'add', 'subtract', 'multiply', 'divide', 'calculate', 'compute', 'process', 'execute', 'run', 'start', 'stop', 'pause', 'resume', 'restart', 'reset', 'refresh', 'reload', 'update', 'upgrade', 'downgrade', 'patch', 'fix', 'repair', 'maintain', 'service', 'support', 'help', 'guide', 'tutorial', 'manual', 'documentation', 'reference', 'api', 'sdk', 'library', 'framework', 'platform', 'system', 'application', 'program', 'software', 'hardware', 'firmware', 'driver', 'kernel', 'os', 'operating', 'windows', 'linux', 'mac', 'unix', 'android', 'ios', 'web', 'mobile', 'desktop', 'server', 'client', 'cloud', 'edge'] },
  { category: 'ui', keywords: ['arrow', 'chevron', 'caret', 'triangle', 'circle', 'square', 'rectangle', 'diamond', 'hexagon', 'octagon', 'star', 'cross', 'plus', 'minus', 'check', 'close', 'menu', 'hamburger', 'sidebar', 'panel', 'tab', 'toggle', 'switch', 'slider', 'knob', 'dial', 'button', 'input', 'textarea', 'select', 'dropdown', 'combobox', 'autocomplete', 'search', 'filter', 'sort', 'pagination', 'page', 'scroll', 'drag', 'drop', 'resize', 'move', 'align', 'justify', 'distribute', 'gap', 'padding', 'margin', 'border', 'radius', 'shadow', 'opacity', 'blur', 'gradient', 'color', 'fill', 'stroke', 'line', 'path', 'curve', 'bezier', 'anchor', 'handle', 'control', 'point', 'node', 'edge', 'link', 'connection', 'wire', 'pipe', 'flow', 'stream', 'channel', 'queue', 'stack', 'heap', 'tree', 'graph', 'network', 'mesh', 'grid', 'table', 'list', 'card', 'tile', 'chip', 'badge', 'tag', 'label', 'tooltip', 'popover', 'modal', 'dialog', 'drawer', 'sheet', 'overlay', 'backdrop', 'mask', 'clip', 'crop', 'zoom', 'pan', 'rotate', 'flip', 'mirror', 'scale', 'skew', 'transform', 'translate', 'transition', 'animation', 'motion', 'spring', 'ease', 'linear', 'step', 'bounce', 'elastic', 'back', 'circ', 'expo', 'sine', 'quad', 'cubic', 'quart', 'quint', 'layout', 'flex', 'wrap', 'nowrap', 'center', 'left', 'right', 'top', 'bottom', 'middle', 'baseline', 'stretch', 'start', 'end', 'between', 'around', 'evenly', 'space', 'size', 'width', 'height', 'min', 'max', 'aspect', 'ratio', 'viewport', 'breakpoint', 'responsive', 'adaptive', 'fluid', 'fixed', 'absolute', 'relative', 'static', 'sticky', 'hidden', 'visible', 'overflow', 'scroll', 'auto', 'ellipsis', 'truncate', 'wrap', 'break', 'word', 'letter', 'line', 'text', 'font', 'weight', 'style', 'decoration', 'outline', 'ring', 'focus', 'hover', 'active', 'disabled', 'selected', 'checked', 'indeterminate', 'invalid', 'valid', 'required', 'optional', 'readonly', 'editable', 'placeholder', 'hint', 'help', 'error', 'warning', 'info', 'success', 'primary', 'secondary', 'tertiary', 'accent', 'neutral', 'muted', 'subtle', 'emphasis', 'strong', 'weak', 'light', 'dark', 'contrast', 'inverse', 'brand', 'custom', 'theme', 'mode', 'variant', 'shape', 'tone', 'intent', 'state', 'status', 'role', 'type', 'kind', 'category', 'group', 'set', 'collection', 'item', 'element', 'component', 'widget', 'control', 'field', 'form', 'input', 'output', 'action', 'event', 'handler', 'callback', 'listener', 'observer', 'subscriber', 'publisher', 'emitter', 'dispatcher', 'broker', 'mediator', 'facade', 'proxy', 'adapter', 'bridge', 'decorator', 'composite', 'flyweight', 'strategy', 'template', 'factory', 'builder', 'prototype', 'singleton', 'command', 'iterator', 'visitor', 'interpreter', 'memento', 'state', 'observer', 'mediator', 'chain', 'responsibility', 'pipeline', 'filter', 'middleware', 'interceptor', 'guard', 'pipe', 'transform', 'map', 'reduce', 'flat', 'partition', 'chunk', 'batch', 'window', 'buffer', 'cache', 'pool'] },
  { category: 'activities', keywords: ['sport', 'game', 'play', 'run', 'walk', 'hike', 'climb', 'swim', 'dive', 'surf', 'ski', 'snowboard', 'skate', 'bike', 'cycle', 'gym', 'fitness', 'workout', 'exercise', 'yoga', 'meditation', 'dance', 'music', 'sing', 'paint', 'draw', 'write', 'read', 'study', 'learn', 'teach', 'work', 'build', 'craft', 'cook', 'bake', 'garden', 'fish', 'hunt', 'camp', 'travel', 'explore', 'adventure', 'compete', 'race', 'win', 'lose', 'score', 'goal', 'team', 'player', 'coach', 'referee', 'umpire', 'judge', 'fan', 'audience', 'spectator', 'crowd', 'stadium', 'arena', 'court', 'field', 'track', 'pool', 'ring', 'mat', 'board', 'card', 'dice', 'chess', 'puzzle', 'quiz', 'trivia', 'challenge', 'quest', 'mission', 'task', 'project', 'hobby', 'leisure', 'entertainment', 'fun', 'party', 'celebration', 'festival', 'concert', 'show', 'performance', 'theater', 'movie', 'film', 'video', 'photo', 'camera', 'art', 'design', 'creative', 'music', 'instrument', 'guitar', 'piano', 'drum', 'violin', 'trumpet', 'saxophone', 'flute', 'clarinet', 'oboe', 'bassoon', 'harp', 'organ', 'synthesizer', 'keyboard', 'microphone', 'speaker', 'headphone', 'amplifier', 'mixer', 'recorder', 'studio', 'stage', 'spotlight', 'curtain', 'ticket', 'admission', 'reservation', 'booking', 'schedule', 'calendar', 'event', 'meeting', 'conference', 'workshop', 'seminar', 'webinar', 'course', 'class', 'lesson', 'tutorial', 'training', 'certification', 'exam', 'test', 'quiz', 'homework', 'assignment', 'project', 'thesis', 'dissertation', 'research', 'experiment', 'lab', 'science', 'math', 'physics', 'chemistry', 'biology', 'history', 'geography', 'language', 'literature', 'philosophy', 'psychology', 'sociology', 'economics', 'politics', 'law', 'medicine', 'engineering', 'architecture', 'design', 'art', 'music', 'drama', 'dance', 'film', 'photography', 'journalism', 'communication', 'marketing', 'business', 'finance', 'accounting', 'management', 'leadership', 'entrepreneurship', 'innovation', 'creativity', 'problem', 'solution', 'strategy', 'planning', 'execution', 'evaluation', 'improvement', 'optimization', 'efficiency', 'productivity', 'quality', 'performance', 'achievement', 'success', 'failure', 'mistake', 'error', 'bug', 'fix', 'debug', 'test', 'verify', 'validate', 'confirm', 'approve', 'reject', 'deny', 'allow', 'permit', 'grant', 'revoke', 'cancel', 'abort', 'terminate', 'kill', 'destroy', 'eliminate', 'erase', 'wipe', 'purge', 'clean', 'sanitize', 'disinfect', 'sterilize', 'quarantine', 'isolate', 'contain', 'restrict', 'limit', 'bound', 'cap', 'floor', 'ceiling', 'threshold', 'trigger', 'activate', 'deactivate', 'enable', 'disable', 'toggle', 'switch', 'flip', 'turn', 'rotate', 'spin', 'twist', 'bend', 'fold', 'unfold', 'expand', 'collapse', 'open', 'close', 'lock', 'unlock', 'secure', 'release', 'free', 'liberate', 'emancipate', 'enslave', 'imprison', 'jail', 'detain', 'arrest', 'capture', 'seize', 'confiscate', 'expropriate', 'nationalize', 'privatize', 'commercialize', 'monetize', 'capitalize', 'invest', 'fund', 'finance', 'bank', 'loan', 'credit', 'debit', 'deposit', 'withdraw', 'transfer', 'wire', 'ach', 'check', 'cash', 'coin', 'currency', 'money', 'dollar', 'euro', 'pound', 'yen', 'yuan', 'rupee', 'peso', 'real', 'rand', 'won', 'baht', 'ringgit', 'rupiah', 'dong', 'taka', 'kyat', 'kip', 'riel', 'tugrik', 'som', 'tenge', 'manat', 'lari', 'dram', 'lira', 'shekel', 'dinar', 'dirham', 'riyal', 'rial', 'afghani', 'lek', 'kuna', 'forint', 'zloty', 'koruna', 'lev', 'denar', 'mark', 'franc', 'guilder', 'escudo', 'peseta', 'drachma'] },
  { category: 'symbols', keywords: ['symbol', 'sign', 'mark', 'badge', 'award', 'medal', 'trophy', 'ribbon', 'flag', 'banner', 'shield', 'crest', 'emblem', 'logo', 'brand', 'trademark', 'copyright', 'registered', 'patent', 'license', 'certificate', 'diploma', 'degree', 'honor', 'distinction', 'achievement', 'milestone', 'landmark', 'monument', 'memorial', 'statue', 'sculpture', 'art', 'artifact', 'relic', 'treasure', 'gem', 'jewel', 'diamond', 'ruby', 'emerald', 'sapphire', 'pearl', 'gold', 'silver', 'bronze', 'platinum', 'copper', 'iron', 'steel', 'aluminum', 'titanium', 'carbon', 'silicon', 'glass', 'ceramic', 'plastic', 'rubber', 'leather', 'wood', 'paper', 'fabric', 'textile', 'cotton', 'wool', 'silk', 'linen', 'denim', 'canvas', 'velvet', 'satin', 'lace', 'fur', 'feather', 'scale', 'shell', 'bone', 'horn', 'ivory', 'amber', 'jet', 'obsidian', 'marble', 'granite', 'limestone', 'sandstone', 'slate', 'quartz', 'infinity', 'omega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'percent', 'hash', 'at', 'ampersand', 'asterisk', 'plus', 'minus', 'equal', 'divide', 'multiply', 'greater', 'less', 'not', 'and', 'or', 'xor', 'nand', 'nor', 'xnor', 'shift', 'rotate', 'flip', 'mirror', 'invert', 'negate', 'abs', 'sqrt', 'pow', 'log', 'exp', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh', 'asinh', 'acosh', 'atanh', 'floor', 'ceil', 'round', 'trunc', 'mod', 'rem', 'gcd', 'lcm', 'factorial', 'permutation', 'combination', 'binomial', 'hypergeometric', 'poisson', 'normal', 'uniform', 'exponential', 'gamma', 'beta', 'chi', 'student', 'fisher', 'weibull', 'logistic', 'lognormal', 'pareto', 'power', 'rayleigh', 'rice', 'nakagami', 'distribution', 'probability', 'statistics', 'mean', 'median', 'mode', 'variance', 'deviation', 'skewness', 'kurtosis', 'correlation', 'covariance', 'regression', 'anova', 'manova', 'ancova', 't-test', 'z-test', 'f-test', 'chi-square', 'kolmogorov', 'smirnov', 'shapiro', 'wilks', 'levene', 'bartlett', 'mauchly', 'box', 'breusch', 'pagan', 'white', 'durbin', 'watson', 'ljung', 'arch', 'garch', 'var', 'vecm', 'cointegration', 'granger', 'causality', 'impulse', 'response', 'variance', 'decomposition', 'forecast', 'error', 'mape', 'rmse', 'mae', 'mase', 'smape', 'mpe', 'rmspe', 'mspe', 'wmape', 'rmsse'] },
  { category: 'objects', keywords: ['box', 'bag', 'basket', 'bucket', 'bin', 'container', 'crate', 'barrel', 'drum', 'tank', 'vessel', 'pot', 'pan', 'bowl', 'plate', 'cup', 'mug', 'glass', 'bottle', 'jar', 'can', 'tube', 'pipe', 'hose', 'rope', 'chain', 'wire', 'cable', 'cord', 'string', 'thread', 'yarn', 'fabric', 'cloth', 'towel', 'blanket', 'pillow', 'mattress', 'bed', 'chair', 'table', 'desk', 'shelf', 'cabinet', 'drawer', 'door', 'window', 'wall', 'floor', 'ceiling', 'roof', 'stairs', 'ladder', 'bridge', 'gate', 'fence', 'lock', 'key', 'bell', 'clock', 'watch', 'mirror', 'lamp', 'light', 'bulb', 'candle', 'torch', 'flashlight', 'lantern', 'fire', 'match', 'lighter', 'tool', 'hammer', 'wrench', 'screwdriver', 'drill', 'saw', 'knife', 'scissors', 'needle', 'pin', 'clip', 'staple', 'tape', 'glue', 'paint', 'brush', 'pen', 'pencil', 'marker', 'crayon', 'chalk', 'eraser', 'ruler', 'compass', 'protractor', 'calculator', 'scale', 'weight', 'measure', 'gauge', 'meter', 'level', 'square', 'plumb', 'chisel', 'file', 'sandpaper', 'grinder', 'polisher', 'buffer', 'wax', 'oil', 'grease', 'lubricant', 'fuel', 'gas', 'water', 'air', 'steam', 'smoke', 'fire', 'ice', 'snow', 'rain', 'wind', 'sun', 'moon', 'star', 'cloud', 'lightning', 'thunder', 'rainbow', 'fog', 'mist', 'haze', 'dust', 'sand', 'mud', 'clay', 'rock', 'stone', 'pebble', 'gravel', 'sand', 'soil', 'dirt', 'earth', 'ground', 'floor', 'wall', 'ceiling', 'roof', 'door', 'window', 'gate', 'fence', 'barrier', 'wall', 'partition', 'screen', 'curtain', 'blind', 'shade', 'awning', 'canopy', 'tent', 'shelter', 'house', 'home', 'building', 'structure', 'construction', 'scaffold', 'crane', 'bulldozer', 'excavator', 'loader', 'truck', 'van', 'car', 'bus', 'train', 'plane', 'ship', 'boat', 'bike', 'motorcycle', 'scooter', 'skateboard', 'roller', 'skate', 'ski', 'snowboard', 'surfboard', 'kayak', 'canoe', 'raft', 'yacht', 'sailboat', 'motorboat', 'submarine', 'helicopter', 'drone', 'rocket', 'satellite', 'space', 'shuttle', 'station', 'probe', 'rover', 'lander', 'orbiter', 'telescope', 'microscope', 'binoculars', 'magnifier', 'lens', 'prism', 'mirror', 'filter', 'polarizer', 'beam', 'splitter', 'combiner', 'isolator', 'circulator', 'attenuator', 'amplifier', 'modulator', 'demodulator', 'mixer', 'oscillator', 'filter', 'resonator', 'cavity', 'waveguide', 'antenna', 'feed', 'horn', 'dish', 'array', 'phased', 'beamforming', 'mimo', 'ofdm', 'cdma', 'tdma', 'fdma', 'gsm', 'lte', '5g', 'wifi', 'bluetooth', 'nfc', 'rfid', 'gps', 'glonass', 'galileo', 'beidou', 'iridium', 'inmarsat', 'thuraya', 'globalstar', 'orbcomm', 'starlink', 'oneweb', 'kuiper', 'project-kuiper', 'telesat', 'lightspeed', 'ses', 'intelsat', 'eutelsat', 'astra', 'hotbird', 'nilesat', 'arabsat', 'asiasat', 'jcsat', 'optus', 'telstar', 'anik'] },
];

const assignLibraryCategory = (kebab) => {
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((keyword) => kebab.includes(keyword))) {
      return rule.category;
    }
  }
  return 'others';
};

const source = readFileSync(dynamicImportsPath, 'utf8');
const kebabMatches = [...source.matchAll(/"([a-z0-9-]+)":\s*\(\)\s*=>\s*import/g)];
const kebabIds = [...new Set(kebabMatches.map((match) => match[1]))].sort();

const iconsById = new Map();

for (const kebab of kebabIds) {
  const id = kebabToPascal(kebab);
  if (iconsById.has(id)) {
    continue;
  }

  const words = kebab.split('-');
  const keywords = [...new Set([...words, kebab, id.toLowerCase()])];

  iconsById.set(id, {
    id,
    label: kebabToLabel(kebab),
    aliases: [kebab],
    keywords,
    libraryCategory: assignLibraryCategory(kebab),
    kebab,
  });
}

const icons = [...iconsById.values()].sort((a, b) => a.id.localeCompare(b.id));
const iconIds = icons.map((icon) => icon.id);

const fileContent = `// Auto-generated by scripts/generateIconRegistry.mjs — do not edit manually.
import type { IconDefinition, IconId, LibraryCategoryId } from './types';

export const ICON_REGISTRY_DATA: Record<IconId, IconDefinition> = ${JSON.stringify(
  Object.fromEntries(icons.map((icon) => [icon.id, icon])),
  null,
  2,
)};

export const ALL_ICON_IDS: IconId[] = ${JSON.stringify(iconIds, null, 2)};

export const ICON_COUNT = ${icons.length};

export const ICONS_BY_LIBRARY_CATEGORY: Record<LibraryCategoryId, IconId[]> = ${JSON.stringify(
  icons.reduce(
    (acc, icon) => {
      acc[icon.libraryCategory].push(icon.id);
      return acc;
    },
    {
      all: iconIds,
      animals: [],
      nature: [],
      food: [],
      objects: [],
      ui: [],
      activities: [],
      travel: [],
      people: [],
      symbols: [],
      files: [],
      devices: [],
      weather: [],
      emotions: [],
      others: [],
    },
  ),
  null,
  2,
)};
`;

writeFileSync(outputPath, fileContent, 'utf8');
console.log(`Generated ${icons.length} icons -> ${outputPath}`);
