import json
import sys
import os

from typing import Callable

JsonDict = dict[str,str|int|float|bool]#also self and JsonList
JsonList = list[str|int|float|bool]#also self and JsonDict


class Do:
	Type = From = Out = None
	def __init__(self,Type,From, Out = None):
		assert Type in doModules, f"Error {Type} not a DoModule"
		self.Type = Type
		self.From = From
		self.Out = Out
	def run(self):
		assert self.Type in doModules, f"Error {self.Type} not a DoModule"
		doModules[self.Type](self.From,self.Out)

pythonToJsonTypes:dict = {
	dict:"Object",
	str:"String",
	int:"Number",
	float:"Number",
	list:"List",
	bool:"Bool"
}


DataStack=[]

def parseTextOrStr(obj,var,Module):
	if type(obj) == dict:
		obj = parseObj(obj)
		assert type(obj) == str, f"An Object in the {var} {Module} module list must be a TextModule"
	assert type(obj) == str, f"{Module} Module {var} must be a string or TextModule"
	return obj

Vars:dict[str,Callable] = {
	"CURDIR":os.getcwd,
	"THISDIR":lambda:DataStack[len(DataStack)-1]["FileLoc"]
}

def parseVar(From,_):
	From = parseTextOrStr(From,"from","VAR")
	assert From in Vars, f"VAR {From} not found"
	return Vars[From]()
def parseText(From,_):
	assert type(From) == str, "TEXT Module from must be a String"
	return From
def parseJoin(From,Out):
	Out = "" if Out == None else Out
	if type(From) == dict:
		From = parseObj(From)
		assert type(From) == list, f"An Object in the from JOIN module list must be a ListModule whereas {From} isnt"
	assert type(From) == list, f"JOIN Module from must be a list or ListModule whereas {From} isnt"
	returnv = ""
	for item in From:
		assert type(item) == dict, "The Elements in the JOIN module list must be Objects"
		parsed = parseObj(item)
		assert type(parsed) == str, "The Elements in the JOIN module list must be TextModules"
		returnv += parsed
	returnv = returnv[:len(returnv)-len(Out)]
	return returnv
def parseFile(From,_):
	From = parseTextOrStr(From,"from","FILE")
	try:
		with open(os.path.normpath(From),"r") as file:
			return file.read()
	except FileNotFoundError:
		assert False, f"error the path'{From}' is not a valid file when trying to navigate there from {os.getcwd()}"
def parseSplit(From,Out):
	From = parseTextOrStr(From,"from","SPLIT")
	Out = parseTextOrStr(Out,"out","SPLIT")
	if Out == "":
		lst = list(From)
	else:
		lst = From.split(Out)
	returnv = []
	for el in lst:
		obj = {}
		obj["type"] = "TEXT"
		obj["from"] = el
		returnv.append(obj)
	return returnv

TextModules = {
	"VAR":parseVar,
	"TEXT":parseText,
	"JOIN":parseJoin,
	"FILE":parseFile,
	"SPLIT":parseSplit,
}

def parseBuild(From,Out):
	From = parseTextOrStr(From,"from","BUILD")
	Out = parseTextOrStr(Out,"out","BUILD")
	cwd = os.getcwd()
	main(["this is the file location",os.path.normpath(From),Out],True)
	os.chdir(cwd)
def parseOutput(From,_):
	From = parseTextOrStr(From,"from","OUTPUT")
	print(From)
def parseHtmlMin(From,Out):#=========================================TEMP JUST COPIES THE CONTENTS
	From = parseTextOrStr(From,"from","MINHTML")
	Out = parseTextOrStr(Out,"out","MINHTML")
	with open(From,"r") as htmlFile, open(Out,"w") as htmlOut:
		htmlOut.write(htmlFile.read())
def parseCssMin(From,Out):
	From = parseTextOrStr(From,"from","MINCSS")
	Out = parseTextOrStr(Out,"out","MINCSS")
	with open(From,"r") as cssFile, open(Out,"w") as cssOut:
		cssOut.write(cssFile.read())
def parseJsMin(From,Out):
	From = parseTextOrStr(From,"from","MINJS")
	Out = parseTextOrStr(Out,"out","MINJS")
	with open(From,"r") as JSFile, open(Out,"w") as JSOut:
		JSOut.write(JSFile.read())#==========================================
def parseGenerate(From,Out):
	From = parseTextOrStr(From,"from","GENERATE")
	Out = parseTextOrStr(Out,"out","GENERATE")
	try:
		with open(Out, "w") as File:
			File.write(From)
	except FileNotFoundError:
		assert False, f"File {Out} not found from location {os.getcwd()}"
def parseCopyFile(From,Out):
	From = parseTextOrStr(From,"from","COPYFILE")
	Out = parseTextOrStr(Out,"out","COPYFILE")
	try:
		with open(From,"r") as File:
			try:
				with open(Out,"w") as To:
					To.write(File.read())
			except FileNotFoundError:
				assert False, f"File {Out} not found from location {os.getcwd()}"
	except FileNotFoundError:
		assert False, f"File {From} not found from location {os.getcwd()}"


doModules = {
	"BUILD":parseBuild,
	"OUTPUT":parseOutput,
	"HTMLMIN":parseHtmlMin,
	"CSSMIN":parseCssMin,
	"JSMIN":parseJsMin,
	"GENERATE":parseGenerate,
	"COPYFILE":parseCopyFile
}

def parseObj(obj):
	assert type(obj) == dict, "Error can only parse an Object (try converting the value to a TEXT object)"
	assert "type" in obj, "Error 'type' must be present in a parsable object"
	assert "from" in obj, "Error 'from' must be present in a parsable object"
	if obj["type"] in TextModules:
		return TextModules[obj["type"]](obj["from"],obj["out"] if "out" in obj else None)
	if obj["type"] in doModules:
		return Do(
			obj["type"],
			obj["from"],
			obj["out"] if "out" in obj else None
		)
	else:
		assert False, f"Error the Module {obj['type']} cannot be found"


def EnvDir(value):
	if type(value) == dict:
		t = parseObj(value)
		assert type(t) == str, f"Error '{value}' must evaluate to string"
		value = t
		del t
	elif type(value) != str:
		assert False, f"Error '{value}' must evaluate to string"
	try:
		os.chdir(os.path.normpath(value))
	except FileNotFoundError:
		assert False, f"error the path'{value}' is not a valid file when trying to navigate there from {os.getcwd()}"


envModules:dict[str,Callable] = {
	"dir":EnvDir
}

def setUpEnv(build:JsonDict):
	if not "enviroment" in build:
		return # no enviroment settings no need to tell
	env = build["enviroment"]
	assert type(env) == dict, f"enviroment is a '{pythonToJsonTypes[type(env)]}' not a Object"
	for key in env:
		if key in envModules:
			envModules[key](env[key])

def runInstructions(build:JsonDict,Command:str):
def runInstructions(build:JsonDict):
	if (not "instructions" in build) or build["instructions"]==[]:
		print("Warning: Nothing for the build to do")# not an error just stupid
		return
	ins = build["commands"][Command]
	assert type(ins) == list, f"Error The instructions must be a list of objects wheras {ins} isnt"
	for obj in ins:
		assert type(obj) == dict, f"Error The instructions must be a list of objects wheras {obj} isnt an obj"
		inst = parseObj(obj)
		assert type(inst) == Do, f"Error The instructions cannot be TextModules wheras {obj} is"
		inst.run()


def main(args:list[str],ignoreFlags = False):
	assert type(args) == list, f"Error {type(args)} not a list[str]"
	assert len(args) > 2,"Error incorect number of args"
	if not ignoreFlags:
		assert not (args[1].startswith("/") or args[1].startswith("-")), "flags NOT IMPLEMENTED YET"
		assert not (args[2].startswith("/") or args[2].startswith("-")), "flags NOT IMPLEMENTED YET"
	try:
		with open(args[1],"r") as buildF:
			build = json.load(buildF)
	except FileNotFoundError:
		assert False, f"Error File {args[1]} cannot be found"
	except json.decoder.JSONDecodeError:
		assert False, f"Error File {args[1]} isnt a valid json format"
	os.chdir(args[1]+"\\..")
	assert type(build) == dict, "The root Element must be an Object"

	DataStack.append({"FileLoc":args[1],"Command":args[2],"Args":" ".join(args[3:])})

	setUpEnv(build)
	runInstructions(build,args[2])

	DataStack.pop()


if __name__ == "__main__":
	try:
		main(sys.argv)
	except AssertionError as e:
		print(e.args[0],file=sys.stderr)