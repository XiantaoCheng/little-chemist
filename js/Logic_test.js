'use strict'

var CInnerSpace=require('./InnerSpace');
var CMatter=require('./Matter');
var world=require('./Laws.js');

var a=new CInnerSpace(4,5,30,30,false,'test',1,true);

function Input(name,state,space,pi,pj,number)
{
    var thing=new CMatter(name,state);
    thing.m_number=number;
    space.Input_Beaker(thing,pi,pj);
}

a.Generate('NaOH','s',3,[[0,0]]);
a.Generate('NaOH','s',2,[[1,0]]);
a.Generate('NaOH','s',1,[[2,0]]);
a.Generate('NaOH','s',3,[[3,0]]);
a.PhysicRun();

a.Generate('Na','s',1,[[1,0]]);
a.Generate('Na','s',1,[[2,0]]);
a.Generate('H2O','l',3,[[3,0]]);
a.Generate('H2','g',0.5,[[0,0]]);
a.Generate('H2','g',1,[[0,1]]);
a.Generate('H2','g',1,[[3,0]]);
a.PhysicRun();

a.ChemistryRun(world);

a.PhysicRun();
a.Generate('H2','g',0.5,[[2,0]]);

console.log(a.Information());
console.log(a.PosOfMatter_Solute('Na*'));