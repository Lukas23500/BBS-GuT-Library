global using API.Data;
global using API.DTOs;
global using API.Entities;
global using API.Entities.Enums;
global using API.MappingConfiguration;
global using API.Services;
global using AutoMapper;
global using AutoMapper.QueryableExtensions;
global using Microsoft.AspNetCore.Mvc;
global using Microsoft.AspNetCore.Mvc.NewtonsoftJson;
global using Microsoft.EntityFrameworkCore;
global using Newtonsoft.Json;
global using System.ComponentModel;
global using System.ComponentModel.DataAnnotations;
global using System.ComponentModel.DataAnnotations.Schema;
global using System.Reflection;
global using System.Text.RegularExpressions;
using API.Extension;

var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureDbContext(builder.Configuration.GetConnectionString("DefaultConnection"));

builder.Services.ConfigureServices();

builder.Services.ConfigureCors();

builder.Services.ConfigureController();

builder.Services.ConfigureHttpsRedirection();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDatabaseDeveloperPageExceptionFilter();

var app = builder.Build();

app.UseCors();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseMigrationsEndPoint();
    app.ConfigureCustomExceptionMiddleware();
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
    app.ConfigureCustomExceptionMiddleware();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllers();

app.ConfigureDatabase();

app.Run();
