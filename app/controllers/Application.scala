package controllers

import play.api._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import models.Story

object Application extends Controller {

  def pageNotFound = Action {
    NotFound(views.html.message(
      "Page could not be found",
      "Seems that the page you're looking for went for a walk and could not be found ever since."))
  }

  def index = Action {
    Redirect(routes.StoryController.index)
  }

}