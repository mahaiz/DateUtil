/**
 * Created by Mahai on 2014/5/5.
 */
(function(self){
	var MIN = 1000 * 60; //1分钟60秒
	var DAY = MIN * 60 * 24;
	var WEEK = DAY * 7;
	var YEAR = DAY * 365;

	function getIntStrAtLength(value, length) {
			var str = value.toString();
			if (length > 1) {
				if (str.length > length) {
					str = str.substr( -length);
				}else {
					while (str.length < length) {
						str = "0" + str;
					}
				}
			}
			return str;
		}
	var test=0
	var DateUtil={
		Test:function(_v){
			if(!_v || _v==undefined){
				return test;
			}else{
				test=_v;
			}
		},
		//将日期转化为字符串：format(new Date(090923),"YY-MM-DD")=09-09-23
		format:function (date, formatStr) {
			var str;
			str = formatStr.replace(/([YMWDhms])\1*/g, function() {
				var matchStr = arguments[0] ;
				var replaceStr;
				switch(matchStr.charAt(0)) {
					case 'Y':
						replaceStr = getIntStrAtLength(date.getFullYear(), matchStr.length);
						break;
					case 'M':
						replaceStr = getIntStrAtLength(date.getMonth() + 1, matchStr.length);
						break;
					case 'W':
						replaceStr = getIntStrAtLength(weeks(date), matchStr.length);
						break;
					case 'D':
						replaceStr = getIntStrAtLength(date.getDate(), matchStr.length);
						break;
					case 'h':
						replaceStr = getIntStrAtLength(date.getHours(), matchStr.length);
						break;
					case 'm':
						replaceStr = getIntStrAtLength(date.getMinutes(), matchStr.length);
						break;
					case 's':
						replaceStr = getIntStrAtLength(date.getSeconds(), matchStr.length);
						break;
				}
				
				return replaceStr;
			});
			return str;
		}
		,
		
		//将数字字符 格式化为日期 ：parse("0923","MMDD")=09.23
		parse:function (str, formatStr)
		{
//			if(isNaN(Number(str)) || Number(str)==0)return new Date();
			//只还原月份和日期时，可能导致闰年问题。new Date(0)=19770101080000,在没有设置年份只设置月日时，02/29 被还原为19770301
			var date = new Date(0);//new Date(0)返回19700101080000，改成字符后则返回00000000000000
			date.setFullYear ((new Date()).getFullYear());//设置当前年份，解决闰年问题
			//console.log("date.getFullYear()="+date.getFullYear(),date.getMonth(),date.getDate())
			str=getIntStrAtLength(str.toString(),formatStr.length);
			formatStr.replace(/([YMDhms])\1*/g, function() {
				var matchStr = arguments[0] ;
				var index = arguments[2];
				//console.log("DateUtil:"+index,matchStr,matchStr.length,str.substr(0,4))
				var value = parseInt(str.substr(index, matchStr.length),10);
				switch(matchStr.charAt(0)) {
					case 'Y':
						date.setFullYear( value);
						break;
					case 'M':
						date.setMonth( value - 1);
						break;
					case 'D':
						date.setDate(value);
						break;
					case 'h':
						date.setHours(value);
						break;
					case 'm':
						date.setMinutes(value);
						break;
					case 's':
						date.setSeconds(value);
						break;
				}
				date.setMilliseconds(0);
				return "";
			});

			return date;
		}
		
		,
		//求秒差值
		minDiff:function (_startDate,_endDate){
			var _milliN0=_startDate.getTime();
			var _milliN1=_endDate.getTime();
			var _diff;
			_diff=_milliN1-_milliN0;
			return _diff;
			}
		,
		//求时间差 interval=YY,MM,DD
		//可再扩展到时，分，秒
		dateAdd:function (date,_number, interval){
			var _currenDate=new Date(date);
			var _day=_currenDate.getDate();
			var _month = _currenDate.getMonth();
			var _year=_currenDate.getFullYear();
			var _hour=_currenDate.getHours();
			var _minutes=_currenDate.getMinutes();
			var _seconds=_currenDate.getSeconds();
			switch (interval){
				case "YY":
					_currenDate.setFullYear(_year+_number);
				break;
				case "3M":
					_currenDate.setMonth(_month+_number*3)
				break;
				case "MM":
					_currenDate.setMonth(_month+_number);
				break;
				case "WW":
					_currenDate.setDate(_day+_number*7);
				break;
				case "DD":
					_currenDate.setDate(_day+_number);
				break;
				case "hh":
					_currenDate.setHours(_hour+_number);
				break;
				case "mm":
					_currenDate.setMinutes(_minutes+_number);
				break;
				case "ss":
					_currenDate.setSeconds(_seconds+_number);
				break;
				}
			return _currenDate;
		}
		,
		//比较两个日期先后顺序是否合理,好理解。
		//dataThan2014(2014-02-24 19:00:00,2014-02-24 19:01:00)<0;
		//dataThan2014(2014-02-24 19:00:00,2014-02-24 19:00:00)==0;
		//dataThan2014(2014-02-24 19:10:00,2014-02-24 19:01:00)>0;
		/*
		当前时间处于2014-02-24 19:00:00到2014-02-24 19:02:00之间:
		(dataThan2014(date,2014-02-24 19:00:00)>=0 && dataThan2014(date,2014-02-24 19:02:00)<=0)
		*/
		dataThan2014:function (_date0,_date1){
			var i=0;
			var _milliN0=_date0.getTime();
			var _milliN1=_date1.getTime();
			i=_milliN0-_milliN1;
			return i;
			
		}	
		,
		//比较两个日期先后顺序是否合理,开始日期在结束日期之前返回1,之后返回-1。
		dataThan:function (_date0,_date1){
			var i=0;
			var _milliN0=_date0.getTime();
			var _milliN1=_date1.getTime();
			if(_milliN0>_milliN1){
				i=-1;
			}else if(_milliN0<_milliN1){
				i=1;
			}
			return i;
				
		}
		,
		//返回星期值
		dataWeek:function (_date,_w){//_w:一周开始的起点值。0为周日为一周的开始，1为周一为一周的开始，2为周二为一周的开始。。。。
			var _weekNum=_date.getDay();
			if(!_w || _w==undefined)_w=1
			_weekNum=(7+_weekNum-_w)%7+1;
			return _weekNum
		}
		,
		ssss:function (_startDate){
			return _startDate.getFullYear()+"年-"+(_startDate.getMonth()+1)+"月-"+_startDate.getDate()+" "+_startDate.getHours()+"时"+_startDate.getMinutes()+"分"+_startDate.getSeconds()+"秒"
			}
		,

		
		//与指定日期差值 interval=YY,3M，MM,WW,DD,hh,mm,ss
		//_t?时间跨度:时间差值 例如:20180303 15:00:00 --20180304 14:30:00 时间跨度是0天,而时间差值则是1天
		dateDiff:function (_startDate,_endDate, _interval,_t){
			var _diff=0;//minDiff(_startDate,_endDate);
			switch(_interval){
				case "YY"://年
					_diff=_endDate.getFullYear()-_startDate.getFullYear();
				break;
				case "3M"://季度
					_diff=DateUtil.month3OfYear(_startDate,_endDate);
				break;
				case "MM"://月
					_diff=DateUtil.monthOfYear(_startDate,_endDate);
				break;
				case "WW"://天
					_diff=DateUtil.weekOfYear(_startDate,_endDate);
				break;
				case "DD"://天
					_diff=DateUtil.dayOfYear(_startDate,_endDate,_t);
				break;
				case "hh"://小时
					_diff=DateUtil.hhOfYear(_startDate,_endDate,_t);
					break;
				case "mm"://分
					_diff=DateUtil.mmOfYear(_startDate,_endDate,_t);
					break;
				case "ss"://秒
					_diff=DateUtil.ssOfYear(_startDate,_endDate);
					break;
			}
			return _diff;
		}
		,
		//返回从开始日期到指定日期的秒数
		ssOfYear:function (_startDate,_endDate){
			if(!_startDate)_startDate=new Date("1/1/1970");
			if(!_endDate)_endDate=new Date();
			
			var _currentTime=_endDate.getTime();
			var _time=_startDate.getTime();
			var _diff = (_currentTime-_time)*0.001;//1000
			return Math.ceil(_diff);
		}
		,
		//返回从开始日期到指定日期的分钟数
		mmOfYear:function (_startDate,_endDate,_t){
			if(!_startDate)_startDate=new Date("1/1/1970");
			if(!_endDate)_endDate=new Date();
			
			/*转换一下*/
			//作此转换取消秒，是因为目的是求的两个时间点的差值，若是求两个时间点的跨度，则不需要做如下转换，而是将日期之间传参
			var _s=_t?_startDate:new Date(_startDate.getFullYear(),_startDate.getMonth(),_startDate.getDate(),_startDate.getHours(),_startDate.getMinutes());
			var _e=_t?_endDate:new Date(_endDate.getFullYear(),_endDate.getMonth(),_endDate.getDate(),_endDate.getHours(),_endDate.getMinutes());
			/*转换一下*/
			var _diff = DateUtil.ssOfYear(_s,_e)*(1/60);
			return _t?Math.floor(_diff):Math.ceil(_diff);
		}
		,
		//返回从开始日期到指定日期的小时数
		hhOfYear:function (_startDate,_endDate,_t){
			if(!_startDate)_startDate=new Date("1/1/1970");
			if(!_endDate)_endDate=new Date();
			
			/*转换一下*/
			//作此转换去掉分钟秒，是因为目的是求的两个时间点的差值，若是求两个时间点的跨度，则不需要做如下转换，而是将日期之间传参
			var _s=_t?_startDate:new Date(_startDate.getFullYear(),_startDate.getMonth(),_startDate.getDate(),_startDate.getHours());
			var _e=_t?_endDate:new Date(_endDate.getFullYear(),_endDate.getMonth(),_endDate.getDate(),_endDate.getHours());
			/*转换一下*/
			
			var _diff = DateUtil.mmOfYear(_s,_e,_t)*(1/60);
			return _t?Math.floor(_diff):Math.ceil(_diff);
		}
		,
		//返回从开始日期到指定日期的月数
		monthOfYear:function (_startDate,_endDate){
			if(!_startDate)_startDate=new Date("1/1/1970");
			if(!_endDate)_endDate=new Date();
			var _diffYear=_endDate.getFullYear()-_startDate.getFullYear();
			var _diffMonth=0;
			if(_diffYear==0){
				_diffMonth=_endDate.getMonth()-_startDate.getMonth();//+1;
			}else{
				_diffMonth=(_diffYear-1)*12+(12-_startDate.getMonth())+_endDate.getMonth();//+1;
			}
			return _diffMonth;
			}
		,
		//返回从开始日期到指定日期的季度数
		month3OfYear:function (_startDate,_endDate){
			//trace(_date.getFullYear()+"年"+(_date.getMonth()+1)+"月"+_date.getDate()+"日")
			if(!_startDate)_startDate=new Date("1/1/1970");
			if(!_endDate)_endDate=new Date();
			var _diffYear=_endDate.getFullYear()-_startDate.getFullYear();
			var _diff3Month=0;
			if(_diffYear==0){
				_diff3Month=DateUtil.date3Month(_endDate)-date3Month(_startDate)+1;
			}else{
				_diff3Month=(_diffYear-1)*4+(4-DateUtil.date3Month(_startDate))+date3Month(_endDate)+1;
			}
			return _diff3Month;
			}
		,
		//返回季度值
		date3Month:function (_date){
			var _3monthNum=_date.getMonth();
			switch (_3monthNum){
				case 0:
					_3monthNum=0;
				break;
				case 1:
					_3monthNum=0;
				break;
				case 2:
					_3monthNum=0;
				break;
				case 3:
					_3monthNum=1;
				break;
				case 4:
					_3monthNum=1;
				break;
				case 5:
					_3monthNum=1;
				break;
				case 6:
					_3monthNum=2;
				break;
				case 7:
					_3monthNum=2;
				break;
				case 8:
					_3monthNum=2;
				break;
				case 9:
					_3monthNum=3;
				break;
				case 10:
					_3monthNum=3;
				break;
				case 11:
					_3monthNum=3;
				break;
				}
			//trace(_3monthNum)
			return _3monthNum;
			}
		,
		//返回从开始日期到指定日期的天数
		dayOfYear:function (_startDate,_endDate,_t){
			if(!_startDate)_startDate=new Date("1/1/1970");
			if(!_endDate)_endDate=new Date();
			//console.log(DateUtil.format(_startDate,'YYYYMMDD'),_startDate.getFullYear(),_startDate.getMonth(),_startDate.getDate())
			/*转换一下*/
			//作此转换去掉小时分钟秒，是因为目的是求的两个时间点的差值，若是求两个时间点的跨度，则不需要做如下转换，而是将日期之间传参
			var _s=_t?_startDate:new Date(_startDate.getFullYear(),_startDate.getMonth(),_startDate.getDate());
			var _e=_t?_endDate:new Date(_endDate.getFullYear(),_endDate.getMonth(),_endDate.getDate());
			/*转换一下*/
			
			var _diff =DateUtil.hhOfYear(_s,_e,_t)*(1/24);
			return _t?Math.floor(_diff):Math.ceil(_diff);
		}
		,
		//返回从开始日期到指定日期的周数差
		weekOfYear:function (_startDate,_endDate,_w){//_w:一周开始的起点值。0为周日为一周的开始，1为周一为一周的开始，2为周二为一周的开始。。。。
			if(!_startDate)_startDate=new Date("1/1/1970");
			if(!_endDate)_endDate=new Date();
			if(!_w || _w==undefined)_w=1;
			var _day = DateUtil.dayOfYear(_startDate,_endDate);//返回天数
			var _week=DateUtil.dataWeek(_startDate,_w);
			_week=Math.ceil((_week+_day)/7)-1;
			return _week;
		}
		,
		//返回日期所在本年度周数
		weeks:function (_date,_w){
			if(!_date)_date=new Date("1/1/1970");
			if(!_w || _w==undefined)_w=1;
			var _startDate=new Date(_date.getFullYear(),0,1);
			return DateUtil.weekOfYear(_startDate,_date,_w)+1;
		}
	}
	//self.DateUtil = DateUtil;
	self.extend(self,{DateUtil:DateUtil});
})($);