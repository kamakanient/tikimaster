/* **************************************************************

   Copyright 2013 Zoovy, Inc.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

************************************************************** */


var admin_trainer = function() {
	var theseTemplates = new Array();
	var r = {


////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



	callbacks : {
//executed when extension is loaded. should include any validation that needs to occur.
		init : {
			onSuccess : function()	{
				app.model.fetchNLoadTemplates(app.vars.baseURL+'extensions/admin/trainer.html',theseTemplates);
				app.rq.push(['css',0,app.vars.baseURL+'extensions/admin/trainer.css','trainer']);
				return true;
				},
			onError : function()	{
//errors will get reported for this callback as part of the extensions loading.  This is here for extra error handling purposes.
//you may or may not need it.
				app.u.dump('BEGIN admin_orders.callbacks.init.onError');
				}
			}
		}, //callbacks



////////////////////////////////////   ACTION    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//actions are functions triggered by a user interaction, such as a click/tap.
//these are going the way of the do do, in favor of app events. new extensions should have few (if any) actions.
		a : {
			showTrainer : function($target,slidesArr)	{
				slidesArr = ["trainer_yourBusiness","trainer_whatYouSell"];
				if($target instanceof jQuery && typeof slidesArr == 'object' && slidesArr.length > 0)	{
					$target.removeData('slides');
					$target.data('slides',slidesArr).attr('data-app-role','trainerContainer');
					for(var i = 0,L = slidesArr.length; i < L; i += 1)	{
						app.u.dump(i+"). "+slidesArr[i]);
						$("<div \/>").addClass((i == 0 ? "" : "displayNone")).attr("data-trainerid",slidesArr[i]).anycontent({
							'templateID':slidesArr[i],
							'data' : app.ext.admin.u.dpsGet('trainer',slidesArr[i]) || {},
							'showLoading':false
							}).appendTo($target);
						}
					app.ext.admin_trainer.u.handleTrainerArticles($target);
					$target.anydelegate();
					app.u.handleButtons($target);
					}
				else	{
					$('#globalMessaging').anymessage({"message":"In admin_trainer.a.showTrainer, either $target not a valid jQuery instance ["+$target instanceof jQuery+"] or slidesArr not an object with length ["+typeof slidesArr+"].","gMessage":true});
					}
				}
			}, //Actions

////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//renderFormats are what is used to actually output data.
//on a data-bind, format: is equal to a renderformat. extension: tells the rendering engine where to look for the renderFormat.
//that way, two render formats named the same (but in different extensions) don't overwrite each other.
		renderFormats : {
//no click event is added to this. do that on a parent element so that this can be recycled.
			youtubeThumbnail : function($tag,data)	{
				$tag.attr('src',"https://i3.ytimg.com/vi/"+data.value+"/default.jpg");
				return true;
				}, //youtubeThumbnail
			}, //renderFormats
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//utilities are typically functions that are exected by an event or action.
//any functions that are recycled should be here.
		u : {
			handleTrainerArticles : function($context)	{
				$("[data-app-role='trainerArticles']",$context).find('article').each(function(){
					var $resource = $(this);
					if($resource.data('resource-type'))	{
						$resource.addClass('resource ui-widget-content ui-corner-all')
						}
					
					
					if($resource.data('resource-type') == 'html')	{
						//just show what's there.
						}
					else if($resource.data('resource-type'))	{
						$resource.anycontent({
							templateID : 'trainerArticleTemplate_'+$resource.data('resource-type'),
							data : $resource.data(),
							showLoading: false
							});
						}
					else	{
						//no resource type? uh oh.
						}
					});
				}
			}, //u [utilities]

//app-events are added to an element through data-app-event="extensionName|functionName"
//right now, these are not fully supported, but they will be going forward. 
//they're used heavily in the admin.html file.
//while no naming convention is stricly forced, 
//when adding an event, be sure to do off('click.appEventName') and then on('click.appEventName') to ensure the same event is not double-added if app events were to get run again over the same template.
		e : {
			
			handleUpdate : function($ele,p)	{
/*
app.model.addDispatchToQ({
	'_cmd':'',
	'_tag':	{
		'datapointer' : '',
		'callback':''
		}
	},'passive');
*/

				},
			
			navigate : function($ele,p)	{
app.u.dump("Navigate!");
var
	$trainer = $ele.closest("[data-app-role='trainerContainer']");
	slidesArr = $trainer.data('slides');
	$thisTrainer = $ele.closest("[data-trainerid]");

if($trainer instanceof jQuery && $trainer.length)	{
	if(typeof slidesArr == 'object' && slidesArr.length && $thisTrainer instanceof jQuery && $thisTrainer.length)	{
		var thisTrainerIndex = $.inArray($thisTrainer.data('trainerid'),slidesArr);
		if(thisTrainerIndex >= 0)	{

			if($ele.data('verb') == 'next')	{
				var $trainer2Show = $("[data-trainerid='"+slidesArr[(thisTrainerIndex+1)]+"']",$trainer);
				$trainer.prepend($trainer2Show);
				$trainer2Show.slideDown();
				$(':input',$thisTrainer).attr('disabled','disabled');
				}
			else if($ele.data('verb') == 'previous')	{
				
				}
			else	{
				$trainer.anymessage({'message':'In admin_trainer.e.navigate, invalid verb set on trigger element.','gMessage':true});
				}

			
			}
		else	{
			//the trainer in focus couldn't be found in the list of trainers. odd.
			$trainer.anymessage({"message":"In admin_trainer.e.navigate, slidesArr has no length.","gMessage":true});
			}
		}
	else	{
		//something necessary could not be found.
		$trainer.anymessage({"message":"In admin_trainer.e.navigate, could slides array is not an object/has no length ["+(typeof slidesArr)+"] or thisTrainer isn't valid/has no length ["+($thisTrainer instanceof jQuery)+"].","gMessage":true});
		}
	}
else	{
	// couldn't find the trainer container. That's no good.
	$('#globalMessaging').anymessage({"message":"In admin_trainer.e.navigate, could not ascertain the trainer container.","gMessage":true});
	}



/*
if($fieldset2show.length)	{
	if($('fieldset:hidden',$form).length === 0)	{
		$("[data-verb='next']",$form).button('disable');
		}
	else if	($('fieldset:visible',$form).length === 1){
		$("[data-verb='previous']",$form).button('disable');
		}
	else	{
		$("[data-app-role='trainerNavButtons']",$form).find('button').button('enable');
		}
	}
*/
				}
			} //e [app Events]
		} //r object.
	return r;
	}