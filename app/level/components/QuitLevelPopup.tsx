"use client";

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface QuitLevelPopupProps {
	open: boolean;
	onPlayOn: () => void;
	onQuit: () => void;
	onClose?: () => void; 
	className?: string;
}

const QuitLevelPopup: React.FC<QuitLevelPopupProps> = ({
	open,
	onPlayOn,
	onQuit,
	onClose,
	className = '',
}) => {
	useEffect(() => {
		if (!open) return;
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose?.();
			}
		};
		window.addEventListener('keydown', handleKey);
		return () => window.removeEventListener('keydown', handleKey);
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div
			className={cn(
				'fixed inset-0 z-50 flex items-center justify-center',
				className
			)}
			aria-modal="true"
			role="dialog"
		>
			{/* Backdrop (clicks do not close) */}
			<div className="absolute inset-0 bg-black/40" />

			{/* Dialog */}
			<Card className="relative z-10 w-[90%] max-w-sm bg-white">
				<CardHeader className="pb-2">
					<h2 className="text-lg font-semibold text-gray-900 flex justify-center text-center">
						Quit level?
					</h2>
				</CardHeader>
				<CardContent className="pt-0">
					<div className="flex flex-col gap-4 items-center">
						<Button
							type="button"
							className="w-40 rounded-xl bg-yellow-400 text-gray-800 hover:bg-yellow-400/90"
							onClick={onPlayOn}
						>
							Play on
						</Button>
						<Button
							type="button"
							className="w-40 rounded-xl text-gray-800 bg-white hover:bg-white"
							onClick={onQuit}
						>
							Quit
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default QuitLevelPopup;
