module Assignment
  class ScoresController < ApplicationController

    def index
      @scores = Pbl::Models::Assignments::Score.where(params.permit(:score_id, :user_id, :limit, :work_id, :owner_id, :owner_type))
    end

    def create
      @score = Pbl::Models::Assignments::Score.create(params[:score])
      render :show
    end

    def show
      @score = Pbl::Models::Assignments::Score.find(params[:id])
    end

    def update
      @score = Pbl::Models::Assignments::Score.update(params[:id], params[:score])
      render :show
    end

    def destroy
      @score = Pbl::Models::Assignments::Score.destroy(params[:id])
      render :show
    end

  end
end