type NodaPublishOptionContent = {
	STACK: {
		type: 'STACK';
		removeOn: {
			delayAfterClose: number;
			delayAfterPublish: number;
			casted: boolean;
		};
	};
	STREAM: {
		type: 'STREAM';
		depth: number;
		remove: {
			delayAfterClose: number;
			delayAfterPublish: number;
		};
	};
	STATE: {
		type: 'STATE';
		remove: {
			delayAfterClose: number;
			delayAfterPublish: number;
		};
	};
};

interface NodaOptions extends Record<keyof NodaContent, unknown> {
	COMMIT: undefined;
	CAST: { state: 'ALIVE' | 'CLOSE' };
	OBSERVE: undefined;
	PUBLISH: NodaPublishOptionContent[keyof NodaPublishOptionContent];
}

type NodaMetadata<T extends keyof NodaContent> = {
	timestamp: number;
	type: T extends 'UNKNOWN' ? Exclude<keyof NodaContent, 'UNKNOWN'> : T;
	source: string;
	options: T extends 'UNKNOWN' ? unknown : NodaOptions[T];
};

type NodaContent = {
	COMMIT: {
		metadata: NodaMetadata<'COMMIT'>;
		value: string;
	};
	CAST: {
		metadata: NodaMetadata<'CAST'>;
		value: string;
	};
	OBSERVE: { metadata: NodaMetadata<'OBSERVE'> };
	PUBLISH: { metadata: NodaMetadata<'PUBLISH'> };
	UNKNOWN: { metadata: NodaMetadata<'UNKNOWN'> };
};
export type NodaContentType = keyof NodaContent;
export type NodaBaseMessage<T extends keyof NodaContent> = NodaContent[T];
