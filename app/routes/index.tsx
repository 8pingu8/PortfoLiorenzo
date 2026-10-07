import { motion, AnimatePresence } from 'framer-motion'
import { Grid } from '../components/grid'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { ClientOnly } from '../components/ClientOnly'
import { Project3DModel } from '../components/course-card'
import { useState } from 'react'

// Dummy data - replace with real data later
const timelineData = [
	{
		year: 'Jan 2026 – ongoing',
		title: 'Full Stack Developer — Flutter',
		company: 'Nexion',
		description:
			'International manufacturer of tyre and wheel service equipment. Building WeNext, Nexion’s cloud platform for connected Industry 4.0 equipment—from a single Flutter codebase on web and mobile. Own entire product sections with BLoC architecture; work on a C++ gateway with secure TLS (OpenSSL); contribute to planning and steady team progress.',
		icon: '🏭',
	},
	{
		year: '2024-2025',
		title: 'Master in Game Programming',
		company: 'Digital Bros Game Academy (online)',
		description: 'Hands-on game development focused on Unreal Engine 5.',
		icon: '🎮',
	},
	{
		year: '2021-2024',
		title: 'QA Engineer',
		company: 'Voxy (previously Fluentify UK Ltd)',
		description:
			'At an international online language-learning company: bug tracking and resolution, Agile coordination in Jira, automation to improve reliability and performance on a large codebase, BigQuery reporting and data warehouse work, and deployment policies with automated pre- and post-release QA. Also worked with AWS for cloud-based solutions.',
		icon: '🔧',
	},
	{
		year: '2021-2022',
		title: 'Mobile Developer — Flutter',
		company: 'Consorzio Copernico SCS',
		description:
			'From-scratch cross-platform surplus-food management for Caritas (iOS, Android, and web) in Flutter, with a RESTful API on a LAMP stack. Published and adopted by many local charities and shops.',
		icon: '📱',
	},
	{
		year: '2017-ongoing',
		title: 'Full Stack Web Developer',
		company: 'Acris SRL',
		description:
			'Italian fintech specializing in credit risk assessment: full-scale IT systems covering all steps of the client business, data-driven financial decision-making, and data analysis, visualization, and management.',
		icon: '💻',
	},
	{
		year: '2015-2020',
		title: 'Bachelor’s in Computer Engineering',
		company: 'Politecnico di Torino',
		description:
			'Graduated while working as a freelance developer—balancing studies with real projects helped me adapt quickly to new stacks and ownership of delivery.',
		icon: '🚀',
	},
]

// Updated skills data with detailed information
const skills = [
	{
		name: 'Flutter & Mobile Development',
		level: 100,
		icon: '📱',
		description:
			'Flutter specialist for web, iOS, and Android—BLoC architecture, REST integration, and owning full product development.',
		tools: ['Flutter', 'Dart', 'BLoC', 'RESTful APIs', 'OpenSSL', 'iOS', 'Android', 'Web'],
		highlights: [
			'WeNext portal — web & mobile from one Flutter codebase',
			'BLoC-driven UI and complex flow ownership',
			'Published Caritas app used by charities nationwide',
			'C++ IoT gateway work with secure TLS',
		],
	},
	{
		name: 'Project Management',
		level: 100,
		icon: '📊',
		description:
			'Extensive experience in project management and Agile methodologies using Jira and lighter tools like Trello. Led and coordinated teams on game projects, enterprise web systems, and Flutter product delivery—including planning, deadlines, and cross-functional communication at Nexion and on international products.',
		tools: ['Jira', 'Trello', 'Git', 'Agile Methodologies'],
		highlights: [
			'Team leadership and coordination',
			'Agile project management',
			'Task tracking and deadline management',
			'Resource allocation and peer planning',
		],
	},
	{
		name: 'Game Development',
		level: 90,
		icon: '🎮',
		description: 'Specialized in game development with a focus on Unreal Engine 5. Experience with multiple game engines and frameworks.',
		tools: ['Unreal Engine 5', 'Unity', 'Godot', 'C++'],
		highlights: [
			'Game mechanics implementation',
			'Performance optimization',
			'Cross-platform development',
			'Game architecture design'
		]
	},
	{ 
		name: 'Maker & Open Source', 
		level: 95, 
		icon: '🛠️',
		description: 'Experienced Fablab tutor and maker, specializing in open source technologies, 3D printing, and robotics. Leading workshops and teaching others about maker culture and technology.',
		tools: ['3D Printing', 'Arduino', 'Robotics', 'Open Source Tech'],
		highlights: [
			'Fablab management and tutoring',
			'3D printing and prototyping',
			'Open source project contribution',
			'Workshop facilitation and teaching'
		]
	},
	{ 
		name: 'Full Stack Development', 
		level: 100, 
		icon: '💻',
		description:
			'Full stack delivery across web and APIs—from frontend architecture to backend implementation, data layers, and cloud integration.',
		tools: ['PHP', 'JavaScript', 'Python', 'SQL', 'AWS', 'RESTful APIs', 'LAMP'],
		highlights: [
			'REST API design and integration',
			'Frontend and backend development',
			'Database design and optimization',
			'Cloud services integration',
		]
	},
	{
		name: 'QA & Automation', 
		level: 90, 
		icon: '🔧',
		description:
			'QA strategy, automated pre/post-release checks, and reliable deployment policies—plus internal automation on large production codebases.',
		tools: ['Automated Testing', 'CI/CD', 'AWS', 'BigQuery'],
		highlights: [
			'Test automation',
			'Deployment automation',
			'Quality assurance processes',
			'Performance optimization'
		]
	},
	{ 
		name: 'Data Management', 
		level: 85, 
		icon: '📊',
		description: 'Experienced in data management, analysis, and visualization. Worked with large datasets and implemented data-driven solutions.',
		tools: ['SQL', 'BigQuery', 'Data Warehousing', 'Data Analysis'],
		highlights: [
			'Data warehouse management',
			'Analytics dashboard creation',
			'Data-driven decision making',
			'Performance monitoring'
		]
	}
]

const funFacts = [
	'Fablab Tutor, I love teaching',
	'Can cook a fantastic pizza',
	'Monster Energy enthusiast',
	'Speak 4 languages (IT, EN, ES, CN)',
	'Pro Clarinet player',
	'Always with a new project in my mind'
]

// Popup component for skill details
function SkillPopup({ skill, onClose }: { skill: typeof skills[0], onClose: () => void }) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
			onClick={onClose}
		>
			<motion.div
				initial={{ scale: 0.95, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.95, opacity: 0 }}
				className="course-card-gradient dark:bg-gray-850 relative flex flex-col gap-5 overflow-hidden rounded-2xl bg-gray-100 p-8 max-w-2xl w-full ring-1 ring-inset ring-[rgba(0,0,0,0.05)] dark:ring-[rgba(255,255,255,0.05)]"
				onClick={e => e.stopPropagation()}
			>
				<div className="flex items-center gap-4 mb-6">
					<span className="text-4xl">{skill.icon}</span>
					<h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{skill.name}</h3>
				</div>
				
				<div className="mb-6">
					<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
						<motion.div
							className="bg-blue-500 h-3 rounded-full"
							initial={{ width: 0 }}
							animate={{ width: `${skill.level}%` }}
							transition={{ duration: 1 }}
						/>
					</div>
				</div>

				<p className="text-gray-700 dark:text-gray-300 mb-6">{skill.description}</p>

				<div className="mb-6">
					<h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Tools & Technologies</h4>
					<div className="flex flex-wrap gap-2">
						{skill.tools.map((tool, index) => (
							<span 
								key={index} 
								className="course-card-button-gradient inline-flex shrink-0 items-center justify-center rounded-full border border-gray-300 bg-gray-100 px-3 py-1 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
							>
								{tool}
							</span>
						))}
					</div>
				</div>

				<div>
					<h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Key Highlights</h4>
					<ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
						{skill.highlights.map((highlight, index) => (
							<li key={index}>{highlight}</li>
						))}
					</ul>
				</div>

				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
				>
					✕
				</button>
			</motion.div>
		</motion.div>
	)
}

export default function Index() {
	const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
	const [selectedSkill, setSelectedSkill] = useState<typeof skills[0] | null>(null)

	return (
		<>
			{/* Hero Section - Floating Panel */}
			<Grid as="main" className="mb-24 !grid-cols-12 gap-10 @container/grid md:gap-10 xl:gap-14">
				<div className="col-span-full @container">
					<motion.div 
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="relative flex gap-5 overflow-hidden rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-6 ring-2 ring-inset ring-gray-200/50 dark:ring-gray-700/50 shadow-lg @sm:gap-6 @sm:p-9 @2xl/grid:gap-6 @2xl/grid:p-9 @6xl/grid:p-12 flex-col @2xl:flex-row mt-24"
					>
						{/* Bio Text */}
						<div className="flex flex-col gap-4 @xs:gap-6 @sm:gap-8 @2xl:w-[75%]">
							<div>
								<h1 className="text-3xl/7 font-semibold text-balance tracking-tight text-gray-800 @sm:text-4xl/7 @2xl/grid:text-3xl/7 @3xl/grid:text-4xl/7 @6xl/grid:text-5xl/9 dark:font-medium dark:tracking-normal dark:text-gray-200 mb-4">
									Full Stack & Flutter Developer <br></br>— Mobile, Web & Game <br></br>— Creative Technologist
								</h1>
								<p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
									Full stack developer specialized in Flutter, with hands-on experience across web, mobile, data, and game development. 
									At Nexion I work on web and mobile, owning whole product sections and enforcing BLoC architecture on WeNext, 
									Nexion’s cloud Industry 4.0 portal for connected equipment.
									<br />
									<br />
									Over eight years I have delivered for international companies (Italy, England, Brazil, USA), adapting quickly to new stacks. I
									shipped a published Flutter app for Caritas surplus-food management (iOS, Android, web + LAMP backend) now used by charities and
									shops across Italy.
									<br />
									<br />
									I also run a small tech lab introducing students to open source, and I keep building games in Unreal Engine 5 (see my portfolio).
									I am a professional clarinetist and love music and audio.
								</p>
							</div>
						</div>

						{/* Profile Image */}
						<div className="relative w-full @2xl:w-[35%] @2xl:flex @2xl:items-center @2xl:justify-center @2xl:self-center" >
							<div className="relative aspect-[3/4] overflow-hidden rounded-xl w-full">
								<img
									src="/pics/ljacutvertical.png"
									alt="Lorenzo"
									className="w-full h-full object-cover"
								/>
								{/* Gradient overlay */}
								<div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 mix-blend-overlay" />
								{/* Border effect */}
								<div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20" />
								{/* Decorative elements */}
								<div className="absolute top-4 right-4 w-24 h-24 bg-blue-500/5 rounded-full" />
								<div className="absolute bottom-4 left-4 w-32 h-32 bg-purple-500/5 rounded-full" />
								{/* Subtle vignette */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
							</div>
						</div>
					</motion.div>
				</div>
			</Grid>

			{/* Skills Section - Floating Cards */}
			<Grid className="mb-24">
				<div className="col-span-full">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Skills & Expertise</h2>
						<p className="text-lg text-gray-600 dark:text-gray-400 italic">Click on any skill to learn more about my experience!</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
						<div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto w-full">
							{skills.slice(0, 2).map((skill, index) => (
								<motion.div
									key={skill.name}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									whileHover={{ scale: 1.05 }}
									onClick={() => setSelectedSkill(skill)}
									onHoverStart={() => setHoveredSkill(skill.name)}
									onHoverEnd={() => setHoveredSkill(null)}
									className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl p-8 ring-2 ring-inset ring-gray-200/50 dark:ring-gray-700/50 shadow-lg cursor-pointer"
								>
									<div className="flex items-center gap-6 mb-6">
										<span className="text-4xl">{skill.icon}</span>
										<h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{skill.name}</h3>
									</div>
									<div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-3">
										<motion.div
											className="bg-blue-500 h-3 rounded-full"
											initial={{ width: 0 }}
											whileInView={{ width: `${skill.level}%` }}
											transition={{ duration: 1, delay: index * 0.1 }}
										/>
									</div>
								</motion.div>
							))}
						</div>

						{skills.slice(2).map((skill, index) => (
							<motion.div
								key={skill.name}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								whileHover={{ scale: 1.05 }}
								onClick={() => setSelectedSkill(skill)}
								onHoverStart={() => setHoveredSkill(skill.name)}
								onHoverEnd={() => setHoveredSkill(null)}
								className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl p-6 ring-2 ring-inset ring-gray-200/50 dark:ring-gray-700/50 shadow-lg cursor-pointer"
							>
								<div className="flex items-center gap-4 mb-4">
									<span className="text-2xl">{skill.icon}</span>
									<h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{skill.name}</h3>
								</div>
								<div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-2.5">
									<motion.div
										className="bg-blue-500 h-2.5 rounded-full"
										initial={{ width: 0 }}
										whileInView={{ width: `${skill.level}%` }}
										transition={{ duration: 1, delay: index * 0.1 }}
									/>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</Grid>

			{/* Skill Popup */}
			<AnimatePresence>
				{selectedSkill && (
					<SkillPopup 
						skill={selectedSkill} 
						onClose={() => setSelectedSkill(null)} 
					/>
				)}
			</AnimatePresence>

			{/* Timeline Section - Floating Panel */}
			<Grid className="mb-24">
				<div className="col-span-full lg:col-span-8 lg:col-start-3">
					<h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-12 text-center">My Journey</h2>
					<div className="space-y-8">
						{timelineData.map((item, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.5, delay: index * 0.2 }}
								className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl p-6 ring-2 ring-inset ring-gray-200/50 dark:ring-gray-700/50 shadow-lg"
							>
								<div className="text-sm text-blue-600 dark:text-blue-400 mb-2">{item.year}</div>
								<div className="flex items-center gap-3 mb-2">
									<span className="flex-shrink-0 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-white">
										{item.icon}
									</span>
									<h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{item.title}</h3>
								</div>
								<div className="text-gray-600 dark:text-gray-400 mb-2">{item.company}</div>
								<p className="text-gray-600 dark:text-gray-300">{item.description}</p>
							</motion.div>
						))}
					</div>
				</div>
			</Grid>

			{/* Fun Facts Section - Floating Cards */}
			<Grid className="mb-24">
				<div className="col-span-full">
				<h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-12 text-center">Fun Facts</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
					{funFacts.map((fact, index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5, delay: index * 0.1 }}
						whileHover={{ scale: 1.05 }}
						className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl p-6 text-center ring-2 ring-inset ring-gray-200/50 dark:ring-gray-700/50 shadow-lg"
					>
						<p className="text-lg text-gray-700 dark:text-gray-300">{fact}</p>
					</motion.div>
					))}
				</div>
				</div>
			</Grid>
		</>
	)
}
