import express, { Application, Router } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import compression from 'compression'
import helmet from 'helmet'
import { cleanEnv, str, num } from 'envalid'
import { logger } from '@/shared/utils/logger'

class App {}
