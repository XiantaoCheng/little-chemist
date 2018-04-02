
//Reaction Container Class
class CContainer
{
    constructor(name)
    {
        this.m_name=name;
        this.m_volume=20;
        this.m_environment=['r'];
        this.m_contain=[];
    }

    input(things)
    {
        var i,j;
        for(j=0;j<things.length;j++)
        { 
            for(i=0;i<this.m_contain.length;i++)
            {
                if(this.m_contain[i].name()===things[j].name())
                {
                    this.m_contain[i].number=this.m_contain[i].number+things[j].number;
                    this.m_contain[i].reacted=this.m_contain[i].reacted+things[j].reacted;
                    things.splice(j,1);
                    j=j-1;
                    break;
                }
            }
        }
        this.m_contain=this.m_contain.concat(things);
    }

    takeout(name)
    {
        var i,j;
        var output=[];
        for(i=0;i<this.m_contain.length;i++)
        {
            for(j=0;j<name.length;j++)
            {
                if(this.m_contain[i].name()===name[j])
                {
                    output=output.concat(this.m_contain.splice(i,1));
                    name.splice(j,1);
                    i=i-1;
                    break;
                }
            }
        }
        return output;
    }

    information()
    {
        var info=`${this.m_name}: ${this.m_environment.join(',')} <br/>`;
        info=info+`Contain: `;
        var i;
        for(i=0;i<this.m_contain.length;i++)
        {
            info=info+`${this.m_contain[i].name()}=${this.m_contain[i].number} mol`;
            if(i<this.m_contain.length-1)
            {
                info=info+', '
            }
        }
        info=info+'<br/>';
        return info;
    }

    reaction(rule)
    {
        var i;
        var products;
        var change=false;
        for(i=0;i<rule.length;i++)
        {
            products=rule[i].reaction(this.m_contain,this.m_environment);
            if(products[1]!=undefined)
            {
                this.input(products[1]);
                change=true;
            }
        }
        for(i=0;i<this.m_contain.length;i++)
        {
            this.m_contain[i].number=this.m_contain[i].number-this.m_contain[i].reacted;
            this.m_contain[i].reacted=0;
            if(this.m_contain[i].number<=0)
            {
                this.m_contain.splice(i,1);
                i=i-1;
            }
        }
        return change;
    }
}
