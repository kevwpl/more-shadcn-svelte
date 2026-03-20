export type APIEntityType = 'component' | 'snippet' | 'function' | 'class';
export type APIMemberKind = 'prop' | 'param' | 'field' | 'method';

export type APIValue = string | number | boolean | null | APIValue[] | { [key: string]: APIValue };

export interface APIMember {
	kind: APIMemberKind;
	key: string;
	valueType: string;
	description?: string;
	bindable?: boolean;
	defaultValue?: APIValue;
	optional?: boolean;
}

export interface APIReturn {
	valueType: string;
	description?: string;
}

export interface APIEntity {
	type: APIEntityType;
	name: string;
	description?: string;
	members: APIMember[];
	returns?: APIReturn;
}

export interface APIRegistry {
	name: string;
	description?: string;
	items: APIEntity[];
}

export interface APIMemberOptions {
	description?: string;
	bindable?: boolean;
	defaultValue?: APIValue;
	optional?: boolean;
}

export interface APIReturnOptions {
	description?: string;
}

function deepClone<T>(value: T): T {
	return JSON.parse(JSON.stringify(value)) as T;
}

abstract class BaseEntityBuilder<TBuilder> {
	protected readonly entity: APIEntity;

	protected constructor(type: APIEntityType, name: string, description?: string) {
		this.entity = {
			type,
			name,
			description,
			members: []
		};
	}

	protected self(): TBuilder {
		return this as unknown as TBuilder;
	}

	protected addMember(
		kind: APIMemberKind,
		key: string,
		valueType: string,
		options: APIMemberOptions = {}
	): TBuilder {
		this.entity.members.push({
			kind,
			key,
			valueType,
			description: options.description,
			bindable: options.bindable,
			defaultValue: options.defaultValue,
			optional: options.optional
		});

		return this.self();
	}

	description(description: string): TBuilder {
		this.entity.description = description;
		return this.self();
	}

	prop(key: string, valueType: string, options: APIMemberOptions = {}): TBuilder {
		return this.addMember('prop', key, valueType, options);
	}

	param(key: string, valueType: string, options: APIMemberOptions = {}): TBuilder {
		return this.addMember('param', key, valueType, options);
	}

	field(key: string, valueType: string, options: APIMemberOptions = {}): TBuilder {
		return this.addMember('field', key, valueType, options);
	}

	method(key: string, valueType: string, options: APIMemberOptions = {}): TBuilder {
		return this.addMember('method', key, valueType, options);
	}

	returns(valueType: string, options: APIReturnOptions = {}): TBuilder {
		this.entity.returns = {
			valueType,
			description: options.description
		};

		return this.self();
	}

	build(): APIEntity {
		return deepClone(this.entity);
	}
}

export class ComponentBuilder extends BaseEntityBuilder<ComponentBuilder> {
	constructor(name: string, description?: string) {
		super('component', name, description);
	}
}

export class SnippetBuilder extends BaseEntityBuilder<SnippetBuilder> {
	constructor(name: string, description?: string) {
		super('snippet', name, description);
	}
}

export class FunctionBuilder extends BaseEntityBuilder<FunctionBuilder> {
	constructor(name: string, description?: string) {
		super('function', name, description);
	}
}

export class ClassBuilder extends BaseEntityBuilder<ClassBuilder> {
	constructor(name: string, description?: string) {
		super('class', name, description);
	}
}

type EntityBuilder = ComponentBuilder | SnippetBuilder | FunctionBuilder | ClassBuilder;
type Configure<T extends EntityBuilder> = (builder: T) => T | void;

export class APIBuilder {
	private readonly registry: APIRegistry;

	constructor(name: string, description?: string) {
		this.registry = {
			name,
			description,
			items: []
		};
	}

	setDescription(description: string): this {
		this.registry.description = description;
		return this;
	}

	private addEntity<T extends EntityBuilder>(builder: T, configure?: Configure<T>): this {
		const configured = configure?.(builder) ?? builder;
		this.registry.items.push(configured.build());
		return this;
	}

	component(name: string, description?: string, configure?: Configure<ComponentBuilder>): this {
		return this.addEntity(new ComponentBuilder(name, description), configure);
	}

	snippet(name: string, description?: string, configure?: Configure<SnippetBuilder>): this {
		return this.addEntity(new SnippetBuilder(name, description), configure);
	}

	function(name: string, description?: string, configure?: Configure<FunctionBuilder>): this {
		return this.addEntity(new FunctionBuilder(name, description), configure);
	}

	class(name: string, description?: string, configure?: Configure<ClassBuilder>): this {
		return this.addEntity(new ClassBuilder(name, description), configure);
	}

	build(): APIRegistry {
		return deepClone(this.registry);
	}

	toJSON(): APIRegistry {
		return this.build();
	}
}

export function defineAPI(name: string, description?: string): APIBuilder {
	return new APIBuilder(name, description);
}