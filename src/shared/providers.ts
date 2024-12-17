import { z } from 'zod';

export const AppProviders = [
    {
        provide: 'ZOD',
        useClass: z,
    },
]