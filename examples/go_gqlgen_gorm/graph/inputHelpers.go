package graph

import (
	"context"

	"github.com/99designs/gqlgen/graphql"
	"github.com/vektah/gqlparser/v2/ast"
)

func DefinedInputArgumentNames(context context.Context, argumentPath ...string) []string {
	fieldContext := graphql.GetFieldContext(context)
	for _, arg := range fieldContext.Field.Field.Arguments {
		if arg.Name == "input" {
			return digIntoArgs(arg.Value.Children, argumentPath...)
		}
	}

	return []string{}
}

func digIntoArgs(argumentList ast.ChildValueList, argumentPath ...string) []string {
	if len(argumentPath) == 0 {
		result := make([]string, len(argumentList))
		for i, arg := range argumentList {
			result[i] = arg.Name
		}
		return result
	}
	for _, arg := range argumentList {
		if arg.Name == argumentPath[0] {
			return digIntoArgs(arg.Value.Children, argumentPath[1:]...)
		}
	}
	return []string{}
}
