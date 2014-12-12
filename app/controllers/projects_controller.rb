class ProjectsController < ApplicationController

  def index
    @projects = Pbl::Project.all
  end

  def create
    @project = Pbl::Project.create(params[:project])
    render :show
  end

  def show
    @project = Pbl::Project.find(params[:id])
  end

  def update
    @project =  Pbl::Project.update(params[:id], params[:project])
    render :show
  end

  def destroy
    @project =  Pbl::Project.destroy(params[:id])
    render :show
  end

end