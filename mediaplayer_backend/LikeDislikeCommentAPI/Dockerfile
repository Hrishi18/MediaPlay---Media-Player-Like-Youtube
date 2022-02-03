FROM mcr.microsoft.com/dotnet/sdk:3.1 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:3.1 AS build
WORKDIR /src
COPY ["LikeDislikeCommentAPI/LikeDislikeCommentAPI.csproj", "LikeDislikeCommentAPI/"]
RUN dotnet restore "LikeDislikeCommentAPI/LikeDislikeCommentAPI.csproj"
COPY . .
WORKDIR "/src/LikeDislikeCommentAPI"
RUN dotnet build "LikeDislikeCommentAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "LikeDislikeCommentAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "LikeDislikeCommentAPI.dll"]

