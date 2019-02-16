from functools import wraps

from django.http import JsonResponse
from django.utils.decorators import available_attrs


def error_response(status, msg):
    response = JsonResponse({'msg': msg})
    response.status_code = status
    return response


def require_post_args(*args_list, check_null=True):
    def decorator(func):
        @wraps(func, assigned=available_attrs(func))
        def inner(request, *args, **kwargs):
            for arg in args_list:
                if (arg not in request.POST or
                        (check_null and request.POST[arg] is None)):
                    return JsonResponse(400,
                        {'msg': "Missing parameter " + arg})
            return func(request, *args, **kwargs)
        return inner
    return decorator
