import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query
} from '@nestjs/common';
import { SessionService } from './session.service';
import { SubmissionService } from '../submissions/submission.service';

@Controller('sessions')
export class SessionController {
	sessionService = new SessionService();
	submissionsService = new SubmissionService();
	@Post()
	create(@Body() payload: any) {
		return this.sessionService.create(payload);
	}

	@Post('/:sessionId/join')
	join(@Body() payload: any, @Param('sessionId') sessionId: string) {
		return this.sessionService.join({...payload, session_id: sessionId});
	}

	@Post('/:sessionId/start')
	start(@Param('sessionId') sessionId: string, @Body() body: any) {
		const { host_name } = body;
		return this.sessionService.start({
			sessionId,
			hostName: host_name
		});
	}

	@Post('/:sessionId/submit')
	submit(@Body() payload: any, @Param('sessionId') sessionId: string) {
		return this.submissionsService.submit({...payload, sessionId});
	}

	@Get('/:sessionId/submissions')
	findSubmissions(@Param('sessionId') sessionId: string) {
		return this.submissionsService.findBySessionId(sessionId);
	}

	@Post('/:sessionId/next-round')
	nextRound(@Param('sessionId') sessionId: string) {
		return this.sessionService.nextRound(sessionId);
	}

	@Get('/:sessionId/rounds/leaderboard')
	findLeaderboard(@Param('sessionId') sessionId: string, @Query() query: any) {
		const { round } = query;
		return this.submissionsService.findRoundLeaderboard(sessionId, round);
	}

	@Post('/:sessionId/submissions/:submissionId')
	scoreSubmission(@Param('sessionId') sessionId: string, @Param('submissionId') submissionId: string, @Body() body: any) {
		const { score } = body;
		return this.submissionsService.scoreSubmission(submissionId, score);
	}

	@Get('/:sessionId/leaderboard')
	findSessionLeaderboard(@Param('sessionId') sessionId: string) {
		return this.sessionService.getSessionLeaderboard(sessionId);
	}

	@Get('/:sessionId/rounds')
	getSessionRounds(@Param('sessionId') sessionId: string) {
		return this.sessionService.getSessionRounds(sessionId);
	}
}
