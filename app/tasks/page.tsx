"use client";
import TopNav from "@/app/components/TopNav";
import BottomNav from "@/app/components/BottomNav";

import { motion } from 'framer-motion';

export default function TasksPage() {
	return (
		<div className="min-h-screen w-full bg-purple-100 relative pt-20 pb-24">
			<TopNav />
			<div className="min-h-[calc(100vh-11rem)] flex flex-col items-center justify-center">
				<motion.img
					src="/images/loader-tube.png"
					alt="Loading"
					className="h-40 w-40"
					initial={{ y: 0, opacity: 1 }}
					animate={{ y: [0, -10, 0] }}
					transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
				/>
				<div className="mt-6 text-center">
					<h1 className="text-2xl">Complete tasks n' earn rewards</h1>
					<p className="text-gray-500 mt-1">Coming soon</p>
				</div>
			</div>
			<BottomNav />
		</div>
	);
}
