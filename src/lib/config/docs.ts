import {
	Rocket,
	Footprints,
	Sparkle,
	Square,
	ArrowBigRightDash,
	ClockArrowUp,
	PanelBottomClose,
	PhoneCall,
	ImagePlus,
	Book,
	SquarePlay,
	Calendar,
	Palette,
	MousePointer2,
	RectangleHorizontal,
	RectangleEllipsis,
	CircleDot,
	QrCode,
	SquareDot,
	Move,
	AudioLines,
	AlignVerticalSpaceAround,
	MoveHorizontal,
	Mouse,
	SquareSplitHorizontal,
	History,
	Dock,
	SquareArrowDown,
	Fingerprint,
	SquareChevronDown,
	Radio,
	CircleGauge,
	Calendars,
	Highlighter
} from 'lucide-svelte';

export const COMPONENT_URL = '/docs/components';

export const docsConfig = [
	{
		title: 'Getting Started',
		links: [{ href: '/docs', label: 'Introduction', icon: Rocket, new: false }]
	},
	{
		title: 'Forms & Inputs',
		links: [
			{
				href: `${COMPONENT_URL}/autocomplete`,
				label: 'Autocomplete',
				icon: Book,
				new: false
			},
			{
				href: `${COMPONENT_URL}/chip`,
				label: 'Chip',
				icon: RectangleHorizontal,
				new: false
			},
			{
				href: `${COMPONENT_URL}/choicebox`,
				label: 'Choicebox',
				icon: SquareDot,
				new: false
			},
			{
				href: `${COMPONENT_URL}/color-picker`,
				label: 'Color Picker',
				icon: Palette,
				new: false
			},
			{
				href: `${COMPONENT_URL}/date-strip`,
				label: 'Date Strip',
				icon: Calendar,
				new: false
			},
			{
				href: `${COMPONENT_URL}/dynamic-select`,
				label: 'Dynamic Select',
				icon: SquareChevronDown,
				new: true
			},
			{
				href: `${COMPONENT_URL}/hold-button`,
				label: 'Hold Button',
				icon: SquareArrowDown,
				new: false
			},
			{ href: `${COMPONENT_URL}/knob`, label: 'Knob', icon: CircleGauge, new: true },
			{
				href: `${COMPONENT_URL}/phone-input`,
				label: 'Phone Input',
				icon: PhoneCall,
				new: false
			},
			{
				href: `${COMPONENT_URL}/scrubbable`,
				label: 'Scrubbable',
				icon: MoveHorizontal,
				new: false
			},
			{
				href: `${COMPONENT_URL}/tag-input`,
				label: 'Tag Input',
				icon: RectangleEllipsis,
				new: false
			},
			{
				href: `${COMPONENT_URL}/wheel-picker`,
				label: 'Wheel Picker',
				icon: AlignVerticalSpaceAround,
				new: false
			}
		]
	},
	{
		title: 'Navigation',
		links: [
			{
				href: `${COMPONENT_URL}/bottom-nav`,
				label: 'Bottom Nav',
				icon: PanelBottomClose,
				new: false
			},
			{ href: `${COMPONENT_URL}/dock`, label: 'Dock', icon: Dock, new: false },
			{
				href: `${COMPONENT_URL}/stepper`,
				label: 'Stepper',
				icon: ArrowBigRightDash,
				new: false
			},
			{
				href: `${COMPONENT_URL}/walkthrough`,
				label: 'Walkthrough',
				icon: Footprints,
				new: false
			}
		]
	},
	{
		title: 'Visuals & Media',
		links: [
			{ href: `${COMPONENT_URL}/audio`, label: 'Audio', icon: Radio, new: true },
			{
				href: `${COMPONENT_URL}/audio-wave`,
				label: 'Audio Wave',
				icon: AudioLines,
				new: false
			},
			{
				href: `${COMPONENT_URL}/compare-slider`,
				label: 'Compare Slider',
				icon: SquareSplitHorizontal,
				new: false
			},
			{
				href: `${COMPONENT_URL}/cursor`,
				label: 'Cursor',
				icon: MousePointer2,
				new: false
			},
			{
				href: `${COMPONENT_URL}/image-zoom`,
				label: 'Image Zoom',
				icon: ImagePlus,
				new: false
			},
			{
				href: `${COMPONENT_URL}/shiny-button`,
				label: 'Shiny Button',
				icon: Sparkle,
				new: false
			},
			{
				href: `${COMPONENT_URL}/spotlight-card`,
				label: 'Spotlight Card',
				icon: Square,
				new: false
			},
			{ href: `${COMPONENT_URL}/video`, label: 'Video', icon: SquarePlay, new: false }
		]
	},
	{
		title: 'Data Display',
		links: [
			{
				href: `${COMPONENT_URL}/big-calendar`,
				label: 'Big Calendar',
				icon: Calendar,
				new: false
			},
			{
				href: `${COMPONENT_URL}/event-card`,
				label: 'Event Card',
				icon: Calendars,
				new: true
			},
			{
				href: `${COMPONENT_URL}/markdown`,
				label: 'Markdown',
				icon: Highlighter,
				new: true
			},
			{
				href: `${COMPONENT_URL}/number-ticker`,
				label: 'Number Ticker',
				icon: ClockArrowUp,
				new: false
			},
			{ href: `${COMPONENT_URL}/qr-code`, label: 'QR Code', icon: QrCode, new: false },
			{
				href: `${COMPONENT_URL}/status-dot`,
				label: 'Status Dot',
				icon: CircleDot,
				new: false
			},
			{ href: `${COMPONENT_URL}/timeline`, label: 'Timeline', icon: History, new: false }
		]
	},
	{
		title: 'Utilities',
		links: [
			{
				href: `${COMPONENT_URL}/horizontal-scroll`,
				label: 'Horizontal Scroll',
				icon: Mouse,
				new: false
			},
			{ href: `${COMPONENT_URL}/sortable`, label: 'Sortable', icon: Move, new: false },
			{
				href: `${COMPONENT_URL}/verify-human`,
				label: 'Verify Human',
				icon: Fingerprint,
				new: false
			}
		]
	}
];
