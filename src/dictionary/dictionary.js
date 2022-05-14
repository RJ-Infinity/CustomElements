class Dictionary extends Function{
	constructor(...args){
		super()
		this.names = [];
		this.values = [];
		var name = true;
		args.forEach((elment)=>{
			if (name){
				this.names.push(elment);
				name = false;
			}else{
				this.values.push(elment);
				name=true;
			}
		})
		if(!name){
			this.values.push(undefined);
		}
		return new Proxy(
			this,
			{
				get(target, name){
					if (name == "name"){
						return undefined;
					}
					return target[name];
				},
				apply: (target, thisArg, args) => {
					return target._call(...args);
				}
			}
		)
	}
	toString(){return "class dictionary{ [code] }"}
	find(value){
		return this.names[this.values.indexOf(value)];
	}
	append(name,value){this._call(name,value);}
	add(name, value){this._call(name,value);}
	get(name){return this._call(name);}
	remove(name){
		var index = this.names.indexOf(name);
		if (index == -1){
			return undefined;
		}
		this.names.splice(index, 1);
		this.values.splice(index, 1);
	}
	_call(...args) {
		if(args.length == 0 || args[0] == undefined){
			return;
		}
		var index = this.names.indexOf(args[0]);
		if(args.length == 1){
			if (index == -1){
				return undefined;
			}else{
				return this.values[index];
			}
		}else if(args.length == 2){
			if (index == -1){
				this.names.push(args[0]);
				this.values.push(args[1]);
			}else{
				this.values[index] = args[1];
			}
		}
	}
	extend(dict){
		if (!(dict instanceof Dictionary)){
			throw new TypeError("value not another dictionary");
		}
		this.names = [...this.names,...dict.names];
		this.values = [...this.values,...dict.values];
	}
}
