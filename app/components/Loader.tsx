"use client";

import { motion } from 'framer-motion';

export default function Loader() {
	return (
		<div className="min-h-screen w-full bg-purple-100 flex items-center justify-center">
			<motion.img
				src="/images/loader-tube.png"
				alt="Loading"
				className="h-40 w-40"
				initial={{ y: 0, opacity: 1 }}
				animate={{ y: [0, -10, 0] }}
				transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
			/>
		</div>
	);
}
