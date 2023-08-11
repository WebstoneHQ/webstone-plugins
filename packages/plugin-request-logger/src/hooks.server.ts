import { sequence } from '@sveltejs/kit/hooks';
import { addRequestLogger, logRequestDetails } from 'webstone-plugin-request-logger';

export const handle = sequence(addRequestLogger, logRequestDetails);
