import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { DB_ERRORS } from '../../shared/utils/constants';
import { ReviewEntityModel } from '../models/entities/review.entity.model';

@Injectable()
export class ReviewsService {
    constructor(@InjectModel('Review') private readonly reviewModel: Model<ReviewEntityModel>) {}

    public async addReview(entityToCreate: ReviewEntityModel): Promise<ReviewEntityModel> {
        try {
            return await this.reviewModel.create(entityToCreate);
        } catch {
            throw new ServiceUnavailableException(DB_ERRORS.OfflineError);
        }
    }

    public async getReviewsForService(serviceId: string): Promise<ReviewEntityModel[]> {
        try {
            return await this.reviewModel.find({ isArchived: false, serviceId })
                                         .sort({ modifiedOn: 'desc' })
                                         .exec();
        } catch {
            throw new NotFoundException(DB_ERRORS.NotFound);
        }
    }

    public async deleteReview(reviewId: string): Promise<void> {
        try {
            const entityToBeDeleted = await this.reviewModel.findById(reviewId).exec();
            entityToBeDeleted.isArchived = true;
            await this.reviewModel.findByIdAndUpdate(reviewId, entityToBeDeleted);
        } catch {
            throw new NotFoundException(DB_ERRORS.NotFound);
        }
    }
}
