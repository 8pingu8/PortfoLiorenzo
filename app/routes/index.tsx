import { motion } from 'framer-motion'
import { Grid } from '../components/grid'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { ClientOnly } from '../components/ClientOnly'
import { Project3DModel } from '../components/course-card'
import { useState } from 'react'

// Dummy data - replace with real data later
const timelineData = [
	{
		year: '2024-2025',
		title: 'Game Developer student',
		company: 'DBGA Academy',
		description: 'Started my journey in game development, learning the ropes of the industry attending a Game Programming Master (UE5) in a specialized academy.',
		icon: '🎮'
	},
	{
		year: '2021-2024',
		title: 'QA Engineer & Web Developer',
		company: 'Fluentify and Voxy',
		description: 'Responsible for bug tracking and resolution, coordinating tasks and deadlines for the team, and Gained QA engineering experience developing reliable deployment policies based on automated pre and post release QA checks. Worked extensively with data and management and coordination through Jira.',
		icon: '💻'
	},
	{
		year: '2017-ongoing',
		title: 'Software Developer - web and mobile',
		company: 'Various companies and freelance projects',
		description: 'Developed multiple projects in different languages and frameworks, gaining experience in software development and project management.',
		icon: '💻'
	},
	{
		year: '2020',
		title: 'Computer-Science Engineer',
		company: 'Politecnico di Torino',
		description: 'Graduated as a Computer-Science Engineer, beginning my journey in software development',
		icon: '🚀'
	}
]

const skills = [
	{ name: 'Project Management', level: 100, icon: '📊' },
	{ name: 'Game Development', level: 90, icon: '🎮' },
	{ name: 'Unreal Engine 5', level: 90, icon: '🎮' },
	{ name: 'Unity, Godot, other smaller game engines', level: 60, icon: '🎮' },
	{ name: 'Programming', level: 100, icon: '💻' },
	{ name: 'Web Development', level: 100, icon: '💻' },
	{ name: 'Mobile Development', level: 80, icon: '💻' }
]

const funFacts = [
	'Fablab Tutor, I love teaching',
	'Can cook a fantastic pizza',
	'Monster Energy enthusiast',
	'Speak 3 languages',
	'Pro Clarinet player',
	'Always with a new project in my mind'
]

export default function Index() {
	const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

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
									Game Developer & Creative Technologist
								</h1>
								<p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
									I am a passionate developer and tech lab manager with a broad range of experience, from web and mobile development 
									to video game design and data management. I'm leading a small tech lab focused on introducing youngs to Open Source technologies, 
									gaining a diverse skill set in managing projects and motivate teams. <br></br><br></br>I have a strong track record of delivering results on 
									key projects for international companies (Italy, England, Brazil, USA) and thrive on tackling new challenges.

									<br></br><br></br>I am now specializing in Game Development in Unreal Engine 5, with a focus on creating immersive and engaging gaming experiences.
									<br></br>I have a wide range of skills in game design, 3D modeling and other fields, in addition to my knowledge in programming, and I am always eager to learn new things.

									<br></br><br></br>I'm also a professional Clarinet player and love music and audio design, especially in the context of video games.
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
					<h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-12 text-center">Skills & Expertise</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
						{/* First skill - larger and centered */}
						{skills.length > 0 && skills[0] && (
							<motion.div
								key={skills[0].name}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5 }}
								whileHover={{ scale: 1.05 }}
								onHoverStart={() => setHoveredSkill(skills[0]?.name || null)}
								onHoverEnd={() => setHoveredSkill(null)}
								className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl p-8 ring-2 ring-inset ring-gray-200/50 dark:ring-gray-700/50 shadow-lg md:col-span-2 lg:col-span-3 max-w-2xl mx-auto"
							>
								<div className="flex items-center gap-6 mb-6">
									<span className="text-4xl">{skills[0].icon}</span>
									<h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{skills[0].name}</h3>
								</div>
								<div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-3">
									<motion.div
										className="bg-blue-500 h-3 rounded-full"
										initial={{ width: 0 }}
										whileInView={{ width: `${skills[0].level}%` }}
										transition={{ duration: 1 }}
									/>
								</div>
							</motion.div>
						)}

						{/* Rest of the skills */}
						{skills.slice(1).map((skill, index) => (
							<motion.div
								key={skill.name}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								whileHover={{ scale: 1.05 }}
								onHoverStart={() => setHoveredSkill(skill.name)}
								onHoverEnd={() => setHoveredSkill(null)}
								className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl p-6 ring-2 ring-inset ring-gray-200/50 dark:ring-gray-700/50 shadow-lg"
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
								className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm relative pl-8 rounded-2xl p-6 ring-2 ring-inset ring-gray-200/50 dark:ring-gray-700/50 shadow-lg"
							>
								<div className="absolute left-0 top-6 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
									{item.icon}
								</div>
								<div className="text-sm text-blue-600 dark:text-blue-400 mb-2">{item.year}</div>
								<h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">{item.title}</h3>
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
