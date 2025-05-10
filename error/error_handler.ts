import { Request, Response, NextFunction } from "express";
import { createLogger, format, transports } from "winston";

const logger = createLogger({
    level: "error",
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [new transports.Console()]
});

export const error_handler_max = (err:unknown,req:Request,res:Response,next:NextFunction)=>{
    if(err instanceof Error){
        res.status(500).json({message:err.message});
export const error_handler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Error) {
        logger.error({ message: err.message, stack: err.stack });
        res.status(500).json({ message: err.message });
        return;
    }
    logger.error("Internal server error");
    res.status(500).json({ message: "Internal server error" });
};