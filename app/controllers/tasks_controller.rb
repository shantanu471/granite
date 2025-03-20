# frozen_string_literal: true

class TasksController < ApplicationController
  respond_to :html, :json, :xml

  def index
    tasks = Task.all
    render status: :ok, json: { tasks: }
  end
end
