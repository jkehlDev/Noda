export type NodaOptions = {
	COMMIT: undefined;
	CAST: { state: 'ALIVE' | 'CLOSE' };
	OBSERVE: undefined;
	PUBLISH: {
		options: { type: NodaPublishType } & (
			| {
					type: 'STACK';
					removeOn: {
						delayAfterClose: number;
						delayAfterPublish: number;
						casted: boolean;
					};
			  }
			| {
					type: 'STREAM';
					depth: number;
					remove: {
						delayAfterClose: number;
						delayAfterPublish: number;
					};
			  }
			| {
					type: 'STATE';
					remove: {
						delayAfterClose: number;
						delayAfterPublish: number;
					};
			  }
		);
	};
};
export type NodaTypeMessages = 'COMMIT' | 'OBSERVE' | 'PUBLISH' | 'CAST';
export type NodaPublishType = 'STACK' | 'STREAM' | 'STATE';
type NodaMetadata<T extends NodaTypeMessages | unknown> = {
	timestamp: number;
	type: T;
	source: string;
} & (T extends NodaTypeMessages ? NodaOptions[T] : { type: NodaTypeMessages });
type NodaContent<T extends NodaTypeMessages> = {
	COMMIT: {
		metadata: NodaMetadata<T>;
		value: string;
	};
	CAST: {
		metadata: NodaMetadata<T>;
		value: string;
	};
	OBSERVE: { metadata: NodaMetadata<T> };
	PUBLISH: { metadata: NodaMetadata<T> };
};
type NodaBaseMessageUnknow = { metadata: NodaMetadata<unknown> };
export type NodaBaseMessage<T extends NodaTypeMessages | unknown> =
	T extends NodaTypeMessages ? NodaContent<T>[T] : NodaBaseMessageUnknow;
export type NodaCommitMessage = NodaBaseMessage<'COMMIT'>;
export type NodaObserveMessage = NodaBaseMessage<'OBSERVE'>;
export type NodaPublishMessage = NodaBaseMessage<'PUBLISH'>;
export type NodaCastMessage = NodaBaseMessage<'CAST'>;
