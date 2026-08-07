using System;
using MassTransit;

namespace AuctionService.Consumers;

public class AuctionCreatedFaultConsumer : IConsumer<Fault<Contracts.AuctionCreated>>
{
    public async Task Consume(ConsumeContext<Fault<Contracts.AuctionCreated>> context)
    {
        Console.WriteLine("--> Consuming fault creation");

        var exception = context.Message.Exceptions.First();
        
        if (exception.ExceptionType == "System.Exception")
        {
            context.Message.Message.Model = "FooBar";
            await context.Publish(context.Message.Message);
        }
        else
        {
            Console.WriteLine("Not an argument exception - update error dashboard somewhere");
        }
    }

}
