'use client';

type AudioPlayerProps = {
	src: string;
};

const AudioPlayer = ({ src }: AudioPlayerProps) => {
	return (
		<audio controls className='w-full'>
			<source src={src} type='audio/mpeg' width='300px' className='w-full' />
			Your browser does not support the audio element.
		</audio>
	);
};

export { AudioPlayer };
