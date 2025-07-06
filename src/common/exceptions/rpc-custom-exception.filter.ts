import { Catch, ExceptionFilter, ArgumentsHost, Logger } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('RpcCustomExceptionFilter');

  catch(exception: RpcException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();

    const rpcError = exception.getError();

    // Log del error para debugging
    this.logger.error(
      `RPC Exception: ${request.method} ${request.url}`,
      {
        error: rpcError,
        userAgent: request.headers['user-agent'],
        ip: request.ip
      }
    );

    if (
      typeof rpcError === 'object' &&
      rpcError !== null &&
      'status' in rpcError &&
      'message' in rpcError
    ) {
      const { status, message, error } = rpcError as {
        status: unknown;
        message: string;
        error?: string;
      };

      const numericStatus = isNaN(Number(status)) ? 500 : Number(status);

      return response.status(numericStatus).json({
        statusCode: numericStatus,
        message,
        error: error || 'Microservice Error',
        timestamp: new Date().toISOString(),
        path: request.url
      });
    }

    // Fallback para errores sin estructura definida
    return response.status(500).json({
      statusCode: 500,
      message: typeof rpcError === 'string' ? rpcError : 'Internal server error',
      error: 'Internal Server Error',
      timestamp: new Date().toISOString(),
      path: request.url
    });
  }
}
