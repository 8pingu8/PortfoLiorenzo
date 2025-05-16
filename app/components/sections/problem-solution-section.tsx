import {
	Tab as ReachTab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	type TabProps,
} from '@reach/tabs'
import { Link } from '@remix-run/react'
import { clsx } from 'clsx'
import { differenceInYears } from 'date-fns'
import { AnimatePresence, motion } from 'framer-motion'
import * as React from 'react'
import { getImgProps, images, type ImageBuilder } from '#app/images.tsx'
import { type Team } from '#app/types.ts'
import { teamTextColorClasses } from '#app/utils/misc.tsx'
import { ArrowLink } from '../arrow-button.tsx'
import { Grid } from '../grid.tsx'
import { ArrowIcon } from '../icons.tsx'
import { H2, H3, Paragraph } from '../typography.tsx'

function Tab({ isSelected, children }: TabProps & { isSelected?: boolean }) {
	return (
		<ReachTab
			className={clsx(
				'hover:text-primary inline-flex w-full items-center border-none p-0 transition focus:bg-transparent',
				{
					'text-primary': isSelected,
					'text-gray-600 dark:text-slate-500': !isSelected,
				},
			)}
		>
			<span>{children}</span>
			<AnimatePresence>
				{isSelected ? (
					<motion.span
						className="ml-8 mt-4 hidden h-12 items-center lg:flex"
						initial={{ x: -20, opacity: 0 }}
						animate={{ x: 0, opacity: 1, transition: { duration: 0.15 } }}
						exit={{ x: 20, opacity: 0, transition: { duration: 0.15 } }}
					>
						<ArrowIcon size={76} direction="right" />
					</motion.span>
				) : null}
			</AnimatePresence>
		</ReachTab>
	)
}

function ContentPanel({
	children,
	active,
	imageBuilder,
}: {
	children: React.ReactNode | React.ReactNode[]
	active: boolean
	imageBuilder: ImageBuilder
}) {
	return (
		<TabPanel className="col-start-1 row-start-1 block">
			<AnimatePresence>
				{active ? (
					<>
						<motion.img
							initial={{ x: -40, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							exit={{ x: 40, opacity: 0 }}
							transition={{ damping: 0, duration: 0.25 }}
							{...getImgProps(imageBuilder, {
								className: 'mb-6 h-44 lg:mb-14',
								widths: [180, 360, 540],
								sizes: ['11rem'],
							})}
						/>

						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.25 }}
						>
							{children}
						</motion.div>
					</>
				) : null}
			</AnimatePresence>
		</TabPanel>
	)
}

interface ProblemSolutionProps {
	workshopCount: string
	workshopStudents: string
	discordMembers: string
	discordMemberPercentage: string
	currentDiscordLeaderTeam: Team | undefined
	callCount: string
	callMinutes: string
	currentCallLeaderTeam: Team | undefined
	talkCount: string
	talkAttendees: string
	currentTalkLeaderTeam: Team | undefined
}

function ProblemSolution({
	workshopCount,
	workshopStudents,
	discordMembers,
	discordMemberPercentage,
	currentDiscordLeaderTeam,
	callCount,
	callMinutes,
	currentCallLeaderTeam,
	talkCount,
	talkAttendees,
	currentTalkLeaderTeam,
}: ProblemSolutionProps) {
	return (
		<Grid>
			<div className="col-span-full mb-12 lg:mb-20">
				<H2 className="mb-4 lg:mb-6">How I can help you</H2>
				<H2 as="p" variant="secondary" className="mb-8">
					I've got several resources to help you level up your skills
				</H2>
				<Paragraph className="mb-8">
					I'm here to help you become a more effective engineer. Here are some ways
					I can help you do that:
				</Paragraph>
			</div>

			<TabList className="col-span-full mb-20">
				<Tab>workshops</Tab>
				<Tab>discord</Tab>
				<Tab>calls</Tab>
				<Tab>talks</Tab>
			</TabList>

			<TabPanels className="col-span-full">
				<TabPanel>
					<H3>Live workshops</H3>
					<Paragraph className="mt-8">
						<strong>{workshopCount}</strong>
						{` workshops have helped `}
						<strong>{workshopStudents}</strong>
						{` engineers level up their skills in React, Testing, and Web
						Development in general. These workshops are `}
						<strong>live</strong>
						{` and `}
						<strong>remote</strong>
						{` so you can improve your skills from anywhere in the world.`}
					</Paragraph>
					<ArrowLink to="/workshops" className="mt-14">
						Check out upcoming workshops
					</ArrowLink>
				</TabPanel>

				<TabPanel>
					<H3>Discord Community</H3>
					<Paragraph className="mt-8">
						<strong>{discordMembers}</strong>
						{` engineers hang out in my discord community to learn together. `}
						<strong>{discordMemberPercentage}</strong>
						{` of them are active every week.`}
						{currentDiscordLeaderTeam ? (
							<>
								{' The '}
								<span
									className={`${
										teamTextColorClasses[currentDiscordLeaderTeam]
									}`}
								>
									<Link
										to="/teams"
										className="underlined"
									>
										<strong>{currentDiscordLeaderTeam.toLowerCase()}</strong>
									</Link>
								</span>
								{' team is currently in the lead.'}
							</>
						) : null}
					</Paragraph>
					<ArrowLink to="/discord" className="mt-14">
						Join the discord community
					</ArrowLink>
				</TabPanel>

				<TabPanel>
					<H3>Office Hours</H3>
					<Paragraph className="mt-8">
						<strong>{callCount}</strong>
						{` calls have been made for a total of `}
						<strong>{callMinutes}</strong>
						{` minutes of conversations with engineers from all over the world
						about React, Testing, and Web Development in general.`}
						{currentCallLeaderTeam ? (
							<>
								{' The '}
								<span
									className={`${
										teamTextColorClasses[currentCallLeaderTeam]
									}`}
								>
									<Link
										to="/teams"
										className="underlined"
									>
										<strong>{currentCallLeaderTeam.toLowerCase()}</strong>
									</Link>
								</span>
								{' team is currently in the lead.'}
							</>
						) : null}
					</Paragraph>
					<ArrowLink to="/calls" className="mt-14">
						Schedule a call
					</ArrowLink>
				</TabPanel>

				<TabPanel>
					<H3>Conference Talks</H3>
					<Paragraph className="mt-8">
						<strong>{talkCount}</strong>
						{` talks have been given to `}
						<strong>{talkAttendees}</strong>
						{` people at conferences all over the world about React, Testing, and
						Web Development in general.`}
						{currentTalkLeaderTeam ? (
							<>
								{' The '}
								<span
									className={`${
										teamTextColorClasses[currentTalkLeaderTeam]
									}`}
								>
									<Link
										to="/teams"
										className="underlined"
									>
										<strong>{currentTalkLeaderTeam.toLowerCase()}</strong>
									</Link>
								</span>
								{' team is currently in the lead.'}
							</>
						) : null}
					</Paragraph>
					<ArrowLink to="/talks" className="mt-14">
						Watch talks
					</ArrowLink>
				</TabPanel>
			</TabPanels>
		</Grid>
	)
}

export { ProblemSolution }
